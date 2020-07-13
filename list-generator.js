let list = ["1Password","5217","AdBlocker","Adobe_Acrobat","Adobe_After_Effects","Adobe_Animate","Adobe_Audition","Adobe_Bridge","Adobe_CC","Adobe_Character_Animation","Adobe_Dimension","Adobe_Dreamweaver","Adobe_Illustrator","Adobe_InCopy","Adobe_Indesign","Adobe_Lightroom","Adobe_Media_Encoder","Adobe_Photoshop","Adobe_Portfolio","Adobe_Prelude","Adobe_Premiere_Pro","Adobe_Rush","Adobe_Spark","Adobe_Stock","Adobe_XD","Affinity_Designer","Affinity_Photo","Affinity_Publisher","Amphetamine","Android_Studio","Android_Studio_Beta","Autodesk_Sketch","Bear_Notes","Calibre","Chrome_Canary","CleanMyMac","CraftDocs","Dashlane","DayOne","Deliveries","Figma","Final_Cut_Pro","Firefox","FontLab","Github","Google_Chrome","HapticKey","Iina","Instagram","Launchpad","MagicPrefs","Material_Colours","Material_Palette_Generator","Microsoft_Edge","Microsoft_Excel","Microsoft_OneNote","Microsoft_Outlook","Microsoft_Powerpoint","Microsoft_Teams","Microsoft_To_Do","Microsoft_Word","Minecraft","NordVPN","Notability","Notion","OneDrive","Opera","Parallels_Desktop","Permute","Permute_Dark","Quip","Redacted","Reflector","Rhinoceros","Screenshots","Sensei","Setapp","Sip","Sketch_copy","Sketchup","Slack","Spark","Spotify","Spotify_Alternate","Sublime_Text","Telegram","Things_3","Tower","Transmit","Trello","Twitter","Ubersischt","Unity_Editor","Unity_Hub","VMware_Fusion","VS_Code","Visual_Studio","Visual_Studio_Code","Whatsapp","XScope","Yoink","Zoom","cDock","iA_writer","iTerm"]

var csv = []

for(let icon in list){
    let iconName = list[icon]
    let mardkDown = '[<img src="https://github.com/elrumo/macOS-Big-Sur-icons-replacements/blob/master/icons/png/'+iconName+'.png?raw=true)" width="100">](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/'+iconName+'.icns)<br>['+iconName+'](https://github.com/elrumo/macOS-Big-Sur-icons-replacements/raw/master/icons/'+iconName+'.icns)'
    csv.push(mardkDown)
}

console.log(csv);