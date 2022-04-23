let navigationIterations = 0;

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
    // navButtonHandler(navElement)
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
                if (projectLink.nextElementSibling ?? false) {
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
                        repoLink.innerHTML = 'Repo'
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
                const mediaCenter = Array.from(element.nextElementSibling.children).filter(el => el.tagName === 'DIV')
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

export const navRadioInitiator = () => {
    // Start by getting all the nav Bubbles, which are all children from nav that are encased in a 'div'
    const navBubbles = Array.from(document.querySelector('nav').children).filter((element) => element.tagName === 'DIV')
    navBubbles.forEach((bubble) => {
        bubble.onclick = async () => {
            displayPage(bubble.lastElementChild)
            navigationAnimation()
        }
    })
}

//We'll call this on click.  My conception is that we'll check for nighttime or daytime, then animate accordingly.
//embedded xml stylesheets appear to be inaccessible from the document.stylesheets call, so we'll have to implement those rules
//here. 
const navigationAnimation = () => {
    const background = document.querySelector('#backgroundSVG').contentDocument
    const viewport = background.querySelector('#viewportSVG')
    if (window.getComputedStyle(viewport).getPropertyValue('opacity') == '0') {
        //Day to night
        diurnalTransition('day', 2500)
    } else {
        //Night to day
        diurnalTransition('night', 2500)
    }
}
// diurnalTransition will assign animations based on state (day/night)
const diurnalTransition = async (state, duration) => {
    const contentCard = document.querySelector('section')
    const sidebar = document.querySelector('.sidebar')
    const gradientMask = document.querySelector('.gradientMask')
    const mainStyle = document.styleSheets[0]
    const background = document.querySelector('#backgroundSVG').contentDocument
    const style = background.styleSheets[0]
    const viewport = background.querySelector('#viewportSVG')
    const skybox = background.querySelector('#skybox')
    const stars = background.querySelector('#stars')
    const mountain = background.querySelector('#mountain')
    const hills = background.querySelector('#hills')
    const desert = background.querySelector('#desert')
    const sun = background.querySelector('#sun')
    const moon = background.querySelector('#moon')

    //Pause all active animations (stars at night).  Should only be one animation, but for safety we'll iterate
    let starAnims = stars.getAnimations()
    starAnims.forEach(anim => anim.pause())

    //Start easy stuff
    viewport.animate(findKeyframesRule('nightfall', style),
        { duration: duration, direction: state === 'day' ? 'normal' : 'reverse', fill: 'forwards' })
    const skyboxChoice = state === 'day' ? 'skybox-night' : 'skybox-day'
    skybox.animate(findKeyframesRule(skyboxChoice, style),
        { duration: duration, direction: 'normal', fill: 'forwards' })
    stars.animate(findKeyframesRule('nightfall', style),
        { duration: duration, direction: state === 'day' ? 'normal' : 'reverse', fill: 'forwards' })
    sidebar.animate(findKeyframesRule('sidebar-color', mainStyle),
        { duration: duration, direction: state === 'day' ? 'normal' : 'reverse', fill: 'forwards' })
    gradientMask.animate(findKeyframesRule('background-gradient-to-night', mainStyle), {
        duration: duration, direction: state === 'day' ? 'normal' : 'reverse', fill: 'forwards'
    })
    // translations
    // due to safari not supporting the composite option, we're going to have to track iterations and offset
    // the translation values for each iteration.  Since these images do not loop, we'll need to reset them
    // after so many iterations
    if (navigationIterations > 5) {
        navigationIterations = 0
    } else {
        navigationIterations += 1
    }
    const mountainAnim = findKeyframesRule('mountain-slide', style)
    // Owing to lack of inspiration, we'll simply assume all animations are two keyframes long, and that we can use the 
    // second keyframes translation as the scale.  Then set the first keyframe to scale * navigationIterations and
    // the second to scale * navigationIterations + 1.  When we reach 6 navigation iterations, translate from scale *
    // navigationIterations back to zero and restart the process.  We'll immediately increment the navigation iterations
    // as we start the page open with a transition.
    const mountainScale = parseInt(mountainAnim[1]['transform'].split("(")[1].split("%")[0])
    mountainAnim[0]['transform'] = 'translateX(' + mountainScale * navigationIterations + '%)'
    if (navigationIterations < 6) {
        mountainAnim[1]['transform'] = 'translateX(' + mountainScale * (navigationIterations + 1) + '%)'
    } else {
        mountainAnim[1]['transform'] = 'translateX(0%)'
    }
    mountain.animate(mountainAnim,
        { duration: duration, direction: 'normal', fill: 'forwards' })
    // Same deal for hills
    const hillAnim = findKeyframesRule('hills-slide', style)
    const hillScale = parseInt(hillAnim[1]['transform'].split("(")[1].split("%")[0])
    hillAnim[0]['transform'] = 'translateX(' + hillScale * navigationIterations + '%)'
    if (navigationIterations < 6) {
        hillAnim[1]['transform'] = 'translateX(' + hillScale * (navigationIterations + 1) + '%)'
    } else {
        hillAnim[1]['transform'] = 'translateX(0%)'
    }
    hills.animate(hillAnim,
        { duration: duration, direction: 'normal', fill: 'forwards' })

    // rotations
    if (state === 'night') {
        sun.animate(findKeyframesRule('celestial-rise', style),
            { duration: duration, direction: 'normal', fill: 'forwards' })
        moon.animate(findKeyframesRule('celestial-set', style),
            { duration: duration, direction: 'normal', fill: 'forwards' })
    } else {
        sun.animate(findKeyframesRule('celestial-set', style),
            { duration: duration, direction: 'normal', fill: 'forwards' })
        moon.animate(findKeyframesRule('celestial-rise', style),
            { duration: duration, direction: 'normal', fill: 'forwards' })
    }
    // Desert compound animation
    // Desert loop is a special case because it's a little bit of a funky loop.  We start at the mid point
    // of the looping animation, so we need to translate to the end of the image, then do a loop, then 
    // translate back to the midpoint of the loop.  This is also an ideal place to shrink and expand our
    // content bar, syncing it's timing with desert start and desert end.
    const desertAnimations = async () => {
        if (navigationIterations < 6) {
            const desertStart = desert.animate(findKeyframesRule('desert-navigate-start', style),
                { duration: duration * 2 / 10, direction: 'normal', iterations: 1 })
            contentCard.animate(findKeyframesRule('content-expand', mainStyle), {
                duration: duration * 2 / 10, direction: 'reverse', iterations: 1, fill: 'forwards'
            })
            await desertStart.finished
            const desertLoop = desert.animate(findKeyframesRule('desert-loop', style), {
                duration: duration * 1 / 2, direction: 'normal', iterations: 1
            })
            contentCard.animate(findKeyframesRule('initial-border-shift', mainStyle), {
                duration: duration * 1 / 2, direction: state === 'day' ? 'normal' : 'reverse', fill: 'forwards'
            })
            await desertLoop.finished
            const desertEnd = desert.animate(findKeyframesRule('desert-slide-on-open', style), {
                duration: duration * 3 / 10, direction: 'normal', iterations: 1
            })
            contentCard.animate(findKeyframesRule('content-expand', mainStyle), {
                duration: duration * 3 / 10, direction: 'normal', iterations: 1, fill: 'forwards'
            })
            await desertEnd.finished
        } else {
            const desertEnd = desert.animate(findKeyframesRule('desert-slide-on-open', style), {
                duration: duration * (3 / 20), direction: 'reverse', iterations: 1
            })
            contentCard.animate(findKeyframesRule('content-expand', mainStyle), {
                duration: duration * 2 / 10, direction: 'reverse', iterations: 1, fill: 'forwards'
            })
            await desertEnd.finished
            const desertLoop = desert.animate(findKeyframesRule('desert-loop', style), {
                duration: duration * (3 / 24), direction: 'reverse', iterations: 6
            })
            await desertLoop.finished
            const desertStart = desert.animate(findKeyframesRule('desert-navigate-start', style),
                { duration: duration * (1 / 10), direction: 'reverse', iterations: 1 })
            contentCard.animate(findKeyframesRule('content-expand', mainStyle), {
                duration: duration * 3 / 10, direction: 'normal', iterations: 1, fill: 'forwards'
            })
            await desertStart.finished
        }
    }
    await desertAnimations()
    if (state === 'day') {
        stars.animate(findKeyframesRule('twinkle', style), {
            duration: 3000, direction: 'normal', iterations: Infinity
        })
    }
}

//Modified version of snippet appearing in this helpful article:
// https://css-tricks.com/controlling-css-animations-transitions-javascript/
function findKeyframesRule(rule, ss) {
    for (var i = 0; i < ss.cssRules.length; ++i) {
        if (ss.cssRules[i].name == rule) {
            return convertCSSRulesToKeyFrameFormat(ss.cssRules[i].cssRules)
        }
    }
    return null;
}

//The tricky part with this task is that keyframe formats and CSSrules don't line up one to one, so we'll have to
//translate the CSS rule into an acceptable keyframe format
function convertCSSRulesToKeyFrameFormat(CSSKeyframeRules) {
    const KeyFrames = []
    // CSSrules are an irregular iterable, so just build a loop
    for (let i = 0; i < CSSKeyframeRules.length; i++) {
        const rawRules = CSSKeyframeRules[i].style.cssText.split(";")
        const ruleNames = []
        rawRules.forEach(rule => {
            const ruleName = rule.split(':')[0].trim()
            if (ruleName !== "") {
                ruleNames.push(ruleName)
            }
        })
        const keyframeObj = {}
        ruleNames.forEach(rule => {
            // string to float if necessary
            const adjustedValue = isNaN(Number(CSSKeyframeRules[i].style.getPropertyValue(rule))) ?
                CSSKeyframeRules[i].style.getPropertyValue(rule) :
                parseFloat(CSSKeyframeRules[i].style.getPropertyValue(rule))
            // format property rule to camel-case if necessary 
            const formattedRule = rule.includes("-") ?
                rule.replace(/-./g, (m) => m[1].toUpperCase()) :
                rule
            keyframeObj[formattedRule] = adjustedValue
        })
        KeyFrames.push(keyframeObj)
    }
    return KeyFrames
}