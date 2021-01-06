const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const gcs = require('@google-cloud/storage'); // Needed to access Firebase Storage
const spawn = require('child-process-promise').spawn;

// const request = require('request');

const png2icons = require("png2icons"); // Needed to convert .png to .icns
const Jimp = require('jimp'); // Used to create low res .png to be served on macosicons.com
const imagemin = require('imagemin'); // Used to compress .png
const imageminPngquant = require('imagemin-pngquant'); // Plugin for imagemin to compress .png files


const join = path.join
const dirnam = path.dirname

functions.config()
admin.initializeApp()

const db = admin.firestore();
const bucket = admin.storage().bucket("macos-icons.appspot.com")

const env = functions.config()

const algoliasearch = require('algoliasearch');

// Initialise the Algolia Client

const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
// const client = algoliasearch(algolia.appid, algolia.apikey);
const index = client.initIndex('macOSicons');

// exports.exportFirestore2Json = functions.https.onRequest(() => { // Used for local development
exports.exportFirestore2Json = functions.https.onCall(() => {
    var data
    db.collection("submissions").where("timeStamp", ">=", 1608940800000).get().then(function (querySnapshot) {
        const orders = [];
        var order = null

        querySnapshot.forEach(doc => {
            order = doc.data();
            orders.push(order);
        });

        data = JSON.stringify(orders)
        console.log(data);

        return { message: JSON.stringify(orders) }
    })
        .catch(function (error) {
            console.error("Error adding document: ", error);
            return false
        });
    return data
})

exports.indexIcon = functions.firestore
    .document('submissions/{iconId}')
    .onCreate((snap, context) => {
        const data = snap
        data.objectID = data.id;
        console.log(data.appName);

        // Add the data to the algolia index
        return index.saveObject(data).then((result) => {
            console.log(result);
        }).catch((e) => {
            console.log(e);
        })
    });

exports.updateIndexIcon = functions.firestore
    .document('submissions/{iconId}')
    .onUpdate((change, context) => {

        const data = change.after.data()
        // console.log(data);
        // data.objectID = data.id;
        // console.log("data: ", data);
        // // console.log("context: ", context);

        let updatedIcon = [{
            appName: data.appName,
            approved: data.approved,

            credit: data.credit,
            email: data.email,
            fileName: data.fileName,
            iconRef: data.iconRef,
            timeStamp: data.timeStamp,
            usersName: data.usersName,
            isReview: data.isReview,
            icnsUrl: data.icnsUrl,
            pngUrl: data.pngUrl,

            objectID: change.after.id
        }]

        // Add the data to the algolia index
        return index.partialUpdateObjects(updatedIcon).then((result) => {
            console.log(result);
        }).catch((e) => {
            console.log(e);
        })
    });

exports.deleteIndexIcon = functions.firestore
    .document('submissions/{iconId}')
    .onDelete((snap, context) => {
        const objectId = snap.id;

        // Delete an ID from the algolia index
        return index.deleteObject(objectId);

    })


// Export all documents to Algolia
// exports.indexIconTest = functions.https.onCall((snap, context) => {
//     const data = snap

//     let dbCollection = db.collection("submissions")

//     dbCollection.get().then(function (querySnapshot) {
//         let num = 1
//         querySnapshot.forEach(function (doc) {
//             let indexData = doc.data()
//             indexData.objectID = doc.id;

//             console.log(indexData.objectID);

//             index.saveObject(indexData).then(()=>{
//                 console.log(num++);
//             }).catch((e)=>{
//                 console.log(e);
//             })
//         })
//     })

//     data.objectID = data.id;
//     console.log(data.id);

//     // Add the data to the algolia index
//     return index.saveObject(data).catch((e)=>{
//         console.log(e);
//     })
// }),

exports.convertToIcns = functions.https.onCall((data, context) => {

    const filePath = data.iconRef
    const fileName = filePath.split("/").pop()


    // Remove the .png from file to get  the name of the app
    let newFileName = fileName.split(".png")
    newFileName.pop()
    newFileName = newFileName[0]
    let newIcnsName = newFileName + ".icns"

    const tmpFilePath = join(os.tmpdir(), newFileName + ".png");

    const docRef = db.collection('submissions').doc(data.id);

    // Set icon to is reviewing to let me know the conversion process has started
    docRef.update({
        isReview: true
    });

    bucket.file(filePath).download({ destination: tmpFilePath }).then(() => {
        (async () => {

            let input = fs.readFileSync(tmpFilePath) // Reads temp saved file
            let output = png2icons.createICNS(input, png2icons.BILINEAR, 0);

            let toUpload = {
                tmpIcns: join(os.tmpdir(), newIcnsName),
                lowResPng: join(os.tmpdir(), newFileName + ".png"),   // Set path for new low-res image
            }

            // Set cloud storage reference for newly created .icns and .png
            let icnsStorageRef = join("icons_approved", newIcnsName)
            let pngStorageRef = join("icons_approved/png", newFileName + ".png")

            console.log("pngStorageRef: ", pngStorageRef);

            // Write .icns to disk
            fs.writeFileSync(toUpload.tmpIcns, output);

            // Create a low res .png of icon
            let resizedTmp = await Jimp.read(input).then(image => {
                image
                    .resize(256, 256)
                    .write(toUpload.lowResPng)

                // console.log("image.bitmap: ", image.bitmap.data);
                return toUpload.lowResPng

            }).catch(err => {
                console.log(err);
            })

            // Compress newly created .png
            await imagemin([resizedTmp], {
                destination: os.tmpdir(),
                plugins: [
                    imageminPngquant({
                        quality: [0.3, 0.3]
                    })
                ]
            }).then(() => {

                // Upload low res .png to storage
                bucket.upload(toUpload.lowResPng, {
                    destination: pngStorageRef,
                    predefinedAcl: 'publicRead'
                }).then(result => {

                    fs.unlinkSync(toUpload.lowResPng) // Locally delete .png
                    let file = bucket.file(filePath)

                    file.makePublic(function (err, apiResponse) { });

                    const cloudFile = result[0];
                    return cloudFile.getMetadata();

                }).then(results => {
                    let pngUrl = results[0].mediaLink
                    docRef.update({
                        approved: true,
                        pngUrl: pngUrl
                    });
                    console.log("pngUrl: ", pngUrl);
                })

                // Upload .icns to storage
                bucket.upload(toUpload.tmpIcns, {
                    destination: icnsStorageRef,
                    predefinedAcl: 'publicRead'
                }).then(result => {
                    fs.unlinkSync(toUpload.tmpIcns) // Locally delete newly converted .icns

                    const cloudFile = result[0];
                    return cloudFile.getMetadata();
                }).then(results => {
                    let icnsUrl = results[0].mediaLink
                    docRef.update({
                        icnsUrl: icnsUrl
                    });
                    console.log("icnsUrl: ", icnsUrl);
                })

                // Set approved to true and write new low res .png and new .icns download URL to Firestore
            })

        })();
    })
    return data
});