import { displayPage, navRadioInitiator} from "./nav.js"

document.addEventListener('DOMContentLoaded', () => {
    const originatingURLParams = new URLSearchParams(window.location.search)
    if (originatingURLParams.has('page') && originatingURLParams.get('page') !== '1') {
        const navlink = document.querySelector('#rad' + originatingURLParams.get('page'))
        if (navlink) {
            displayPage(navlink)
        } else {
            const baseURL = window.location.toString().replace(window.location.search, "")
            history.pushState({}, "", baseURL)
        }
    } else {
        const navlink = document.querySelector('#rad1')
        navlink.checked = true
    }
    navRadioInitiator()
})
