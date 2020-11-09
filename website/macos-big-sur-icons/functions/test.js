const fs = require('fs');
// var png2icns = require('png2icns');


fs.open('icon/icons.png', 'w', function (err, file) {
    console.log(file);
    if (err) throw err;
    console.log('Saved!');
});
