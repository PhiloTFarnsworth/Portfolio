import { displayPage, navRadioInitiator} from "./nav.js"

document.addEventListener('DOMContentLoaded', () => {
    //Check for users browsing specific portfolio page
    const originatingURLParams = new URLSearchParams(window.location.search)
    if (originatingURLParams.has('page') && originatingURLParams.get('page') !== '1') {
        const navlink = document.querySelector('#rad' + originatingURLParams.get('page'))
        if (navlink) {
            displayPage(navlink, true)
        } else {
            const baseURL = window.location.toString().replace(window.location.search, "")
            history.pushState({}, "", baseURL)
        }
    } else {
        const navlink = document.querySelector('#rad1')
        navlink.checked = true
    }
    //Set up Radio buttons
    navRadioInitiator()
    // Listen for history changes
    addEventListener('popstate', e => {
        const originatingURLParams = new URLSearchParams(window.location.search)
        if (originatingURLParams.has('page') && originatingURLParams.get('page') !== '1') {
            const navlink = document.querySelector('#rad' + originatingURLParams.get('page'))
            if (navlink) {
                displayPage(navlink, false)
            } else {
                displayPage(document.querySelector('#rad1'), false)
            }
        } else {
            displayPage(document.querySelector('#rad1'), false)
        }
    })
})
