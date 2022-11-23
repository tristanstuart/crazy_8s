import { faGhost, faHippo, faPlane, faPoo, faUserAstronaut } from '@fortawesome/free-solid-svg-icons'

const icons = [faUserAstronaut, faPoo ,faHippo, faPlane, faGhost]
const icon_color = ['#d6d3d1', '#a16207', "#d8b4fe", "#c7d2fe", "#fafaf9",]

function generateRandomIconIndex() {
    return Math.floor(Math.random() * icons.length)
}

function generateRandomIconColor() {
    return Math.floor(Math.random() * icon_color.length)
}

function generateRandomIcon(){
    return {icon:generateRandomIconIndex(), color:generateRandomIconColor()}
}

export {icons, icon_color, generateRandomIcon};