const fs = require('fs');
const _ = require('underscore')
const path = require('path')


const icns_file = path.resolve(__dirname, '../icns.txt')
const icns_dir = path.resolve(__dirname, '../icons')

const dirents = fs.readdirSync(icns_dir, {
    withFileTypes: true
});
const fileNames = dirents
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name)
    .map(dirent => dirent.replace('.icns', ''))


const index = fileNames.indexOf('.DS_Store');
if (index > -1) {
    fileNames.splice(index, 1);
}

let contents_of_txt = fs.readFileSync(icns_file, 'utf8').split(',\n');


let comparison = (_.difference(fileNames, contents_of_txt))
let final_txt = _.uniq(_.union(comparison, contents_of_txt));

let i;
let target_str = [];
for (i = 0; i < final_txt.length; i++) {
    _.uniq(target_str.push(final_txt[i] + ",\n"))
}


fs.writeFile(icns_file, _.uniq(target_str.sort(function (a, b) {
    return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
})).join(''), function (err) {
    if (err) return console.log(err);
});