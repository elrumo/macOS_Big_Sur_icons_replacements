const Parse = require('parse/node');
require('dotenv').config();

const VITE_PARSE_APP_ID = process.env.VITE_PARSE_APP_ID
const VITE_PARSE_JAVASCRIPT_KEY = process.env.VITE_PARSE_JAVASCRIPT_KEY
const VITE_PARSE_URL = process.env.VITE_PARSE_URL
const MASTER_KEY = process.env.MASTER_KEY

Parse.initialize(VITE_PARSE_APP_ID, VITE_PARSE_JAVASCRIPT_KEY, MASTER_KEY)
Parse.serverURL = VITE_PARSE_URL


async function changeUserNames() {
    const queryUser = new Parse.Query(Parse.User);
    queryUser.doesNotExist("nameToShow");
    queryUser.ascending("createdAt");
    queryUser.limit(500);
    console.log(await queryUser.count());
    let userInfo = await queryUser.find();
    
    let errorUsernames = []

    userInfo.forEach((user) => {
        let originalUsername = user.get('username');
        let username = user.get('username');
    
        user.set('nameToShow', username);

        username = username.replaceAll(' ', '_')
        username = username.toLowerCase()

        user.set('username', username);
        user.save(null, { useMasterKey: true }).then((data) =>{
            console.log(data);
        }).catch((error)=>{
            errorUsernames.push(username)
            console.log(error, originalUsername);
            console.log("errorUsernames: ", originalUsername);
        })
    })

}

changeUserNames()