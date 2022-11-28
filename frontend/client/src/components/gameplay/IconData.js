import { faGhost, faHippo, faPlane, faPoo, faUserAstronaut, faCar, faFishFins, faBug, faDragon, faSnowman, faSpaghettiMonsterFlying } from '@fortawesome/free-solid-svg-icons'

const icons = [faUserAstronaut, faPoo ,faHippo, faPlane, faGhost, faCar, faFishFins, faBug, faDragon, faSnowman, faSpaghettiMonsterFlying]
const icon_color = ['#d6d3d1', '#a16207', "#d8b4fe", "#c7d2fe", "#afdba8", "#2baf8c", "#a0192d", "#6e23ba", "#0b137f", "#1a4c28", "#efb058", "#cecb1e", "#303030"]

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