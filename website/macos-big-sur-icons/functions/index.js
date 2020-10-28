const functions = require('firebase-functions');

// HTTP Request - convertToIcns
exports.convertToIcns = functions.https.onCall((data, context) => {
    console.log(data);
    return data
});