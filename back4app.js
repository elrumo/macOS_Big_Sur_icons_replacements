var Parse = require('parse/node');
const axios = require('axios')
const { Buffer } = require('buffer');
const request = require('request-promise');
const { resolve } = require('path');


// Parse.initialize('macOSicons', 'macOSicons');
// Parse.serverURL = 'https://media.macosicons.com/parse';
// var Categories = Parse.Object.extend("Categories");
// var Users = Parse.Object.extend("_User");
var Icons = Parse.Object.extend("Icons2");

let parseAppId = 'JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc';
let parseJsApi = 'm6CDglgxjbC14JOUlwzdl5Yjp2TCMvHJJfnT0H4L';
let parseRestApi = '8AiItnvMLbFUHP6ViJChzLm4WMwO1RbzqxeVVYCo';
let parseServerUrl = 'https://parseapi.back4app.com/';

Parse.initialize(parseAppId, parseJsApi, 'J3TG1fm6jeYldM12bK53RXOMIj2d77BI4K6LeK5Z');
Parse.serverURL = parseServerUrl;

var mainClass = Icons;

async function getAllData(className){
    const query = new Parse.Query(mainClass);
    const results = await query.limit(1).find();
    
    results.forEach(async element => {

        let fields = [
            {name: 'icnsFile', type: 'file'},
            {name: 'highResPngFile', type: 'file'},
            {name: 'lowResPngFile', type: 'file'},
            {name: 'iOSPngFile', type: 'file'},
            {name: 'ACL', type: 'ACL'},
            {name: 'User', type: 'pointer', className:'_User'},
            {name: 'DownloadCount', type: 'pointer', className:'DownloadCount'},
            {name: 'type', type: 'pointer', className:'IconType'},
            {name: 'category', type: 'pointer', className:'Categories'},
        ];

        let fieldsUsers = [
            {name: 'ACL', type: 'ACL'},
            {name: 'favIcons', type: 'pointer', className:'Icons2'},
            {name: 'Role', type: 'pointer', className:'_Role'}
        ];

        let obj = {
            username: element.id,
            // ACL: element.attributes.ACL,
        }
        // let obj = {
        //     appName: element.attributes.appName,
        //     approved: element.attributes.approved,
        //     timeStamp: element.attributes.timeStamp,
        //     createdAtOriginal: { "__type": "Date", "iso": element.attributes.createdAt},
        //     downloads: element.attributes.downloads,
        //     usersName: element.attributes.usersName,
        //     isReview: element.attributes.isReview,
        //     ACL: element.attributes.ACL,
        // }
        // console.log(className, ": ", element.id);
        saveObject(className, obj);
    });
}

async function saveObject(className, object) {
    const apiPath = 'classes/'+className;
    const url = `${parseServerUrl}/${apiPath}`

    try {
        let request = await axios({
            method: 'POST',
            url: url,
            headers: {
                'X-Parse-Application-Id': parseAppId,
                'X-Parse-Javascript-Key': parseJsApi,
                'Content-Type': 'application/json',
            },
            data: object
        })
        console.log(request.data);
    } catch (error) {
         console.log(error);   
    }
}

async function later(delay) {
    const newPromise = new Promise(function(resolve) {
        setTimeout(() => {
            resolve();
        }, delay);
    });

    return await newPromise;
}

async function saveImageToParse(fileName, url, parseObject, fileColumn, emptyColumn, urlColumn) {
    const newPromise = new Promise((resolve, reject) => {
        const options = {
            uri: url,
            resolveWithFullResponse: true,
            encoding: null, // <-- this is important for binary data like images.
        };
        
        request(options)
        .then(async (response) => {
            const data = Array.from(Buffer.from(response.body, 'binary'));
            let fileSize = Buffer.byteLength(response.body, 'utf8');
            const kilobytes = fileSize / 1024;
            const megabytes = kilobytes / 1024;
            fileSize = megabytes.toFixed(1) + ' MB';
            const contentType = response.headers['content-type'];
            const file = new Parse.File(fileName, data, contentType);
            file.save().then((savedFile) => {
                parseObject.set(fileColumn, file);
                parseObject.set(emptyColumn, false);
                parseObject.set(urlColumn, savedFile._url);
                parseObject.save(null, { useMasterKey: true }).then(() => {
                    console.log("fileSize: ", fileSize);
                    // file = null;
                    // data = null;
                    resolve('Saved file to Parse Server \n');
                }).catch(error => {
                    resolve('Problem saving parse with image: ', error);
                });
            }).catch(async error => {
                parseObject.set(emptyColumn, true);
                parseObject.save(null, { useMasterKey: true }).then(() => {
                    resolve('Problem saving image: ', error);
                })
            });
        }).catch(async error => {
            try {
                parseObject.set(emptyColumn, true);
                parseObject.save(null, { useMasterKey: true }).then(() => {
                    resolve('File not found: ', url);
                })
            } catch (error2) {
                resolve('General error:', error, url);
            }
        });
    });

    return console.log(await newPromise);
}

async function getImages(limit, fileFormat, urlColumn, emptyColumn, fileColumn) {
    function isAlphanumeric(str) {
        return str.match(/^[a-zA-Z0-9 ]+$/) !== null;
    }
    
    const newPromise = new Promise(async (resolve, reject) => {
        const query = new Parse.Query(mainClass);
        query.exists(urlColumn);
        // query.equalTo(emptyColumn, true);
        query.doesNotExist(emptyColumn);
        let results = await query.limit(limit).find();
        let totalCount = await query.count();
        console.log(totalCount);

        let memoryUsedAtStart = process.memoryUsage().heapUsed / 1024 / 1024;
        memoryUsedAtStart = Math.round(memoryUsedAtStart * 100) / 100+ 'MB';
        console.log('memoryUsed before: ', memoryUsedAtStart);

        if (totalCount === 0){
            resolve()
        };

        for(let i = 0; i < results.length; i++) {
            let element = results[i];
            let fileName = element.attributes.appName.replace(/ /g, '_') + fileFormat;
            let url = element.attributes[urlColumn];
            isAlphanumeric(fileName) ? fileName : fileName = element.id + fileFormat;

            await saveImageToParse(fileName, url, element, fileColumn, emptyColumn, urlColumn);
            await later(30);

            let memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
            memoryUsed = Math.round(memoryUsed * 100) / 100+ 'MB';

            console.log(url);
            console.log(memoryUsed, i, "/", totalCount);
            
            if (i === results.length - 1) {
                resolve();
            }
        }
    });
    return newPromise;
}

async function replaceField(limit, fileColumn, urlColumn) {
    const newPromise = new Promise(async (resolve, reject) => {
        const query = new Parse.Query(mainClass);
        query.exists(fileColumn);
        const results = await query.limit(limit).find();
        const totalCount = await query.count();

        for(let i = 0; i < results.length; i++) {
            let element = results[i];
            let file = element.attributes[fileColumn];
            element.set(urlColumn, file._url);
            element.save(null, { useMasterKey: true }).then(() => {
                console.log(file._url);
                console.log(i, "/", totalCount);
                if (i === results.length - 1) {
                    resolve();
                }
            })
            await later(50);
        }
    });
    return newPromise;
}

async function transferIconsAndUsers(){
    const newPromise = new Promise(async (resolve, reject) => {
        const query = new Parse.Query(mainClass);
        const results = await query.limit(100000).find();
        const totalCount = await query.count();
        console.log(totalCount);

        for(let i = 0; i < results.length; i++) {
            let element = results[i];
            let icon = element.attributes.icon;
            let iconFile = new Parse.File(icon.name(), icon);
            console.log("iconFile: ", iconFile);
            return
            iconFile.save().then((savedFile) => {
                element.set('icon', savedFile);
                element.save(null, { useMasterKey: true }).then(() => {
                    console.log(savedFile._url);
                    console.log(i, "/", totalCount);
                    if (i === results.length - 1) {
                        resolve();
                    }
                })
            })
            await later(50);
        }
    });
    return newPromise;
}


(async () => {
    // try {
    //     await replaceField(90000, 'icnsFile', 'icnsUrl');
    //     console.log('done changing URL\n');
    // } catch (error) {
    //     console.log("error replacing url: ", error, '\n');
    // }
    // await getImages(90000, '.icns', 'icnsUrl', 'icnsEmpty', 'icnsFile');
    // console.log('done icnsFile\n');
    // await getImages(90000, '.png', 'lowResPngUrl', 'lowResPngEmpty', 'lowResPngFile');
    // console.log('done lowResPng\n');
    // await getImages(90000, '.png', 'highResPngUrl', 'highResPngEmpty', 'highResPngFile');
    // console.log('done highResPng\n');
    // await getImages(90000, '.png', 'iOSUrl', 'iOSEmpty', 'iOSFile');
    await transferIconsAndUsers()
    console.log('done iOS\n');
    console.log('done All :)');
})();


// getImages(5000, 'icnsUrl', 'icnsEmpty');
// getAllData('_User');