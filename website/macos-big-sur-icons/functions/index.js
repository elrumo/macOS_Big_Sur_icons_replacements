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
const dirnam  = path.dirname

functions.config()
admin.initializeApp()

const db = admin.firestore();
const bucket = admin.storage().bucket("macos-icons.appspot.com")

// console.log(workingDir);
// if (workingDir) {
//     // console.log(tmpFilePath);
// } else{
//     console.log(false);
// }

// var httpsReference = bucket.refFromURL('https://firebasestorage.googleapis.com/v0/b/macos-icons.appspot.com/o/icon_submissions%2F1603576951238_Atom.png?alt=media&token=6b75a71b-1306-47a2-9c95-827c4b4fe8d2');


// HTTP Request - convertToIcns
exports.convertToIcns = functions.https.onCall((data, context) => {

    const filePath = data.iconRef
    const fileName = filePath.split("/").pop()


    // Remove the .png from file to get  the name of the app
    let newFileName = fileName.split(".png")
    newFileName.pop()
    newFileName = newFileName[0]
    let newIcnsName = newFileName + ".icns"

    const tmpFilePath = join(os.tmpdir(), newFileName + ".png");

    bucket.file(filePath).download({ destination: tmpFilePath }).then(() => {
        (async () => {

            let input = fs.readFileSync(tmpFilePath)
            let output = png2icons.createICNS(input, png2icons.BILINEAR, 0);

            let toUpload = {
                tmpIcns: join(os.tmpdir(), newIcnsName),
                lowResPng: join(os.tmpdir(), newFileName + ".png"),   // Set path for new low-res image
            }

            // Set cloud storage reference for newly creaed .icns and .png
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
                
                const docRef = db.collection('submissions').doc(data.id);

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