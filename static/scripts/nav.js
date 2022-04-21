// Returns a promise to load content.  Expects a navElement (radio button) to a json file.  Sets 'main' element content and updates current page with
// current 'weight', updates browser history.
export const displayPage = async (navElement) => {
    // TODO: start Animation

    const response = await fetch(navElement.value, { method: 'GET' })
    if (!response.ok) {
        // TODO: Error message
        return null
    }
    const data = await response.json()
    // See single.json.json for JSON template
    populateProject(data)
    // update history pointing to static site page (for now).
    const baseURL = window.location.toString().replace(window.location.search, '')
    history.pushState({}, '', baseURL + '?page=' + data.weight)
    navElement.checked = true
    toggleLabels(navElement.parentElement)
    navButtonHandler(navElement)
}

// Pass data from request to populate Project, then use that data to populate project fields.
const populateProject = (data) => {
    // content children -> logo banner object, header -> h1, h1, main -> div -> .data -> URLs, 
    // Tools, Timeline, .highlights -> ul, .mediaCenter -> h3, div -> picture -> img 
    document.querySelector(".bannerLogo").setAttribute('data', data.permalink + data.logo)
    document.querySelector(".bannerLogo").setAttribute('title', data.logo + " banner")
    document.querySelector("h1").innerHTML = data.title
    document.querySelector("h2").innerHTML = data.buzz
    Array.from(document.querySelectorAll("h3")).forEach((element) => {
        switch (element.innerHTML) {
            case "URLs":
                // Set href
                const projectLink = element.nextElementSibling
                projectLink.setAttribute('href', data.projectURL)
                if (projectLink.nextElementSibling.tagName === 'A') {
                    if (data.projectURL === data.repoURL) {
                        projectLink.nextElementSibling.remove()
                    } else {
                        projectLink.nextElementSibling.setAttribute('href', data.repoURL)
                    }
                } else {
                    if (data.projectURL === data.repoURL) {
                        //do nothing
                    } else {
                        const repoLink = document.createElement('a')
                        repoLink.setAttribute('href', data.repoURL)
                        repoLink.innerHTML = 'Repository Link'
                        projectLink.insertAdjacentElement('afterend', repoLink)
                    }
                }
                break;
            case "Tools":
                element.nextElementSibling.innerHTML =
                    data.tools.map(tool =>
                        '<i class="devicon-' + tool + '-plain colored" title="' + tool + '"></i>').join("")
                break;
            case "Timeline":
                element.nextElementSibling.innerHTML = data.projectStart + "-" + data.projectEnd
                break;
            case "Highlights":
                element.nextElementSibling.innerHTML = data.highlights.map(highlight =>
                    '<li>' + highlight + '</li>').join("")
                break;
            case "Media":
                const images = [data.images.filter(image => image.endsWith('.avif')),
                data.images.filter(image => image.endsWith('.webp')),
                data.images.filter(image => image.endsWith('.png'))]
                // div -> h3, div -> picture -> source, source, img x 3
                const mediaCenter = Array.from(element.parentElement.children).filter(el => el.tagName === 'DIV')
                mediaCenter.forEach((div, index) => {
                    Array.from(div.firstElementChild.children).forEach((subElement, subindex) => {
                        if (subElement.tagName === 'IMG') {
                            subElement.setAttribute('src', data.permalink + images[subindex][index])
                            subElement.setAttribute('alt', 'TODO: Figure out alts')
                        } else {
                            subElement.setAttribute('srcset', data.permalink + images[subindex][index])
                        }
                    })
                })
                break;
            default:
                break;
        }
    })
}

// toggleLabels take a navElement which has been selected and makes its label visible, while also hiding all unselected
// navigational elements labels.  We take a nav element, then use iterate over the parent element, if the element returned is
// a navigational element with label, change visibility of label as appropriate.
const toggleLabels = (navElement) => {
    const navBubbles = Array.from(navElement.parentElement.children).filter((element) => element.tagName === "DIV")
    navBubbles.forEach((child) => {
        if (child === navElement) {
            //make label visible.  Since we're always going to place labels first, we can use firstChild.
            const label = Array.from(child.children).find((element) => element.tagName === 'LABEL')
            label.hidden = false
        } else {
            //make label invisible.  
            const label = Array.from(child.children).find((element) => element.tagName === 'LABEL')
            label.hidden = true
        }
    })
}

// navClickHandler will take the entire nav element, then iterate over all children to set or update their 
// onclick functionality
export const navButtonHandler = async (activeNavElement) => {

    //First we need to identify just where we are.  'prev' and 'next' are the divs adjacent to active element.  From this,
    //we can populate the next and previous buttons.
    const prev = activeNavElement.parentElement.previousElementSibling
    const next = activeNavElement.parentElement.nextElementSibling
    // Active nav is the radio button, so its grandparent is our total nav
    const nav = activeNavElement.parentElement.parentElement

    Array.from(nav.children).forEach((child) => {
        // First, Find Buttons
        if (child.tagName === 'BUTTON') {
            // Then Find the right button
            if (child.id === 'prevPage') {
                //Finally validate position in navigation.  In this case, if our previous element is a button, it means we're 
                //on the first page of a collection 
                if (prev.tagName === 'BUTTON') {
                    //On the static site, first page doesn't display button, so hide.
                    child.setAttribute('style', 'display:none;')
                } else {
                    child.innerHTML = 'Prev'
                    child.setAttribute('title', 'Previous Page - ' + prev.getAttribute("title"))
                    // Do button stuff
                    child.onclick = () => {
                        displayPage(prev.lastElementChild)
                    }
                    if (child.getAttribute('style') === 'display:none;') {
                        child.setAttribute('style', '')
                    }
                }
            } else {
                if (next.tagName === 'BUTTON') {
                    child.setAttribute('style', 'display:none;')
                } else {
                    child.innerHTML = "Next"
                    child.setAttribute('title', 'Next Page - ' + next.getAttribute('title'))
                    // Do button stuff
                    child.onclick = () => {
                        displayPage(next.lastElementChild)
                    }
                    if (child.getAttribute('style') === 'display:none;') {
                        child.setAttribute('style', '')
                    }
                }
            }
        }
    })
}

export const navRadioInitiator = () => {
    // Start by getting all the nav Bubbles, which are all children from nav that are encased in a 'div'
    const navBubbles = Array.from(document.querySelector('nav').children).filter((element) => element.tagName === 'DIV')
    navBubbles.forEach((bubble) => {
        bubble.onclick = () => {
            displayPage(bubble.lastElementChild)
        }
    })
}