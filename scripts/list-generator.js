var list = []

const fetch = require('node-fetch');

fetch('https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icns.txt')
  .then(response => response.text())
  .then((data) => {
    list = data.split(", ")

    var csv = []
    var i = 0;

    for(let icon in list){
        if(i == 0){
            let iconName = list[icon]
            let markDown = '[<img src="https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/png/low-res/'+iconName+'.png" width="100">](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/'+iconName+'.icns)<br>['+iconName+'](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/'+iconName+'.icns),'
            i++
            csv.push(markDown)
        } else{
            let iconName = list[icon]
            let markDown = '[<img src="https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/png/low-res/'+iconName+'.png" width="100">](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/'+iconName+'.icns)<br>['+iconName+'](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/'+iconName+'.icns)'
            csv.push(markDown)
            i--
        }
    }

    // console.log(list)
    csv.forEach(item=>{console.log(item)})

  })

//   [<img src="https://github.com/elrumo/macOS-Big-Sur-icons-replacements/blob/master/icons/png/1Password.png?raw=true)" width="100">](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/1Password.icns)<br>[ 1Password ](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/1Password.icns),
