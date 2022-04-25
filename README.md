# Portfolio
## My Gallery of Achievement

Why are you reading the readme?  The website is [right here](https://philotfarnsworth.github.io/Portfolio/)!

## About this portfolio
I designed this portfolio to be an eye-catching showcase that would both give me an area to describe some of my past projects, while also being itself a demonstration of my web development skills.  I also felt it would be an ideal place to demonstrate my process of development, from the first concept art on pen and paper, all the way to its implementation on the screen.

While this readme will cover some of the broad aspects of the development process, if you're more interested in a more granular view of my process, please check the closed issues and PR requests for this repo, where I go into more detail about the implementation.

### Some Numbers
- ~3.3 Mb
  - Size for End User
    - Includes 16 images, 6 SVGs, and all contents.
- 4 '100s'
  - Perfect scores from Lighthouse website auditor.

### Portfolio Goals
I had three main goals heading into the design of this project:

- Ease of Use
  - Streamline creation and updating of project data
- Immersive Experience
  - Animations
  - Activity
  - Shiny
- Accessibility
  - Don't allow 'Immersive Experience' goal to render page unreadable 

### HTML and Hugo
To satisfy my 'Ease of Use' requirement, I settled on building the site with a static site generator.  After enjoying using Hugo in a previous project, I felt that would be a fine choice to build this portfolio site.  Considering the amount of work that could be done with the templating prowess of Hugo, I also felt that I could eschew a large javascript framework and create the front-end experience with a minimal overhead.  With those savings, I felt I could afford to maximize the 'shiny' item of our 'Immersive Experience' goal.

### SVG and Inkscape
With those considerations, I decided to sketch out an ideal design for the pages layout, which you can see in issue #1.  With that rough sketch in mind, I contacted a friend and asked if they could provide me the art assets necessary to create the background image.  A couple days later, I received several images and set to work on the background.  Unfortunately, these images were huge, and I needed to process them in Inkscape and create a much smaller, scalable SVG which would be easily animated.  This experience served me well, so I also created SVG logos for each project using the Inkscape editor.  

The background and logos were then incorporated into the page, and their animations are built with CSS files included in their XML definitions.

### CSS, JS and Beyond
Beyond the animations, CSS was utilized to create the layout as well as store all our animations for our Javascript navigation.  Our navigation script is an adaptation of the script I used in [A Pretty Hugoin' Website](https://github.com/PhiloTFarnsworth/APrettyHuGOinWebsite), though instead of injecting raw HTML our JSON responses are optimized to return only the necessary information.  This information is then parsed and placed in the HTML document after the appropriate header, which cuts down on excessive `div`s and simplifies styling ( though I'm not sold on the method I used, but it was a successful, if not terribly expandable experiment).

With all things considered, I'm pretty happy with the final result.  In two weeks, I went from preliminary conception to a working concept, and accomplished all the goals laid out.  It might not be the exact method I use for future pages, but I'm not terribly concerned with future maintainability, owing to its simple structure.

