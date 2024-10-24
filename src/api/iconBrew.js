import alertWithCircle24 from "../assets/icons/iconBrew/24px/outline/alert-with-circle.svg"
import trash24 from "../assets/icons/iconBrew/24px/outline/trash.svg"
import uploadToCloud24 from "../assets/icons/iconBrew/24px/outline/upload-to-cloud.svg"
import trashWithLines24 from "../assets/icons/iconBrew/24px/outline/trash-with-lines.svg"
import twitter24 from "../assets/icons/iconBrew/24px/outline/twitter.svg"
import share24 from "../assets/icons/iconBrew/24px/outline/share.svg"
import close24 from "../assets/icons/iconBrew/24px/outline/close.svg"

import alertWithCircle18 from "../assets/icons/iconBrew/18px/outline/alert-with-circle.svg"
import trash18 from "../assets/icons/iconBrew/18px/outline/trash.svg"
import uploadToCloud18 from "../assets/icons/iconBrew/18px/outline/upload-to-cloud.svg"
import trashWithLines18 from "../assets/icons/iconBrew/18px/outline/trash-with-lines.svg"
import twitter18 from "../assets/icons/iconBrew/18px/outline/twitter.svg"
import share18 from "../assets/icons/iconBrew/18px/outline/share.svg"
import close18 from "../assets/icons/iconBrew/18px/outline/close.svg"

import twitter24_filled from "../assets/icons/iconBrew/24px/filled/twitter.svg"

import twitter18_filled from "../assets/icons/iconBrew/18px/filled/twitter.svg"

const icons = {
    outline: {
        alertWithCircle24,
        trash24,
        uploadToCloud24,
        trashWithLines24,
        twitter24,
        share24,
        close24,
        
        alertWithCircle18,
        trash18,
        uploadToCloud18,
        trashWithLines18,
        twitter18,
        share18,
        close18
    },
    filled: {
        twitter24_filled,
        close24_filled: close18,
        twitter18_filled,
        close18_filled: close18
    }
}

function iconBrew(icon, isFilled = false) {
    switch (isFilled) {
        case true:
            return icons.filled[icon+'_filled'];
            break;
        default:
            return icons.outline[icon];
            break;
    }
}

export default iconBrew;
