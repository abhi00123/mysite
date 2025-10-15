// Step 1: Select the last 3 divs containing the picture elements inside .newscroll.block
var imageDivs = document.querySelectorAll('.newscroll-wrapper .newscroll.block > div:nth-last-child(-n+3)');

// Step 2: Select the .newscroll-wrapper where the new div will be appended
var newscrollWrapper = document.querySelector('.newscroll-wrapper');

// Step 3: Create a new div with the class 'combined-images' to hold the last 3 divs
var combinedDiv = document.createElement('div');
combinedDiv.classList.add('combined-images'); // Add the class 'combined-images'

// Step 4: Check if the image divs exist and append them to the combined div
if (imageDivs.length > 0 && newscrollWrapper) {
    imageDivs.forEach(function(div) {
        // Append each of the last 3 divs (with pictures) to the new combined div
        combinedDiv.appendChild(div);
    });

    // Step 5: Append the combined div inside the .newscroll-wrapper
    newscrollWrapper.appendChild(combinedDiv);
}
// Select all the testimonial divs and images
var testimonials = document.querySelectorAll('.newscroll-wrapper .newscroll.block > div');
var images = document.querySelectorAll('.newscroll-wrapper .combined-images div picture img');

// Function to show the next testimonial and zoom in the image
function showNextTestimonial() {
    // Get the currently visible testimonial (with active class)
    var currentTestimonial = document.querySelector('.newscroll-wrapper .newscroll.block > div.active');
    
    // Get the next testimonial, loop back to the first if we are at the end
    var nextTestimonial = currentTestimonial.nextElementSibling || testimonials[0];

    // Hide the current testimonial and zoom out the current image
    currentTestimonial.classList.remove('active');
    currentTestimonial.classList.add('hidden');
    var currentImage = currentTestimonial.querySelector('div picture img');
    if (currentImage) currentImage.classList.remove('zoom-effect'); // Remove zoom effect

    // Show the next testimonial and zoom in the corresponding image
    nextTestimonial.classList.remove('hidden');
    nextTestimonial.classList.add('active');
    var nextImage = nextTestimonial.querySelector('div picture img');
    if (nextImage) nextImage.classList.add('zoom-effect'); // Apply zoom effect
}

// Initial setup: Hide all testimonials except the first one and make it active
testimonials.forEach(function(testimonial, index) {
    if (index !== 0) {
        testimonial.classList.add('hidden'); // Initially hide all except the first
    } else {
        testimonial.classList.add('active'); // Set the first testimonial as active
    }
});

// Step 3: Set interval for automatic transition every 5 seconds (adjust timing as needed)
setInterval(showNextTestimonial, 5000); // Transition every 5 seconds





// Select all image divs and images
var imageDivs = document.querySelectorAll('.combined-images > div');
var images = document.querySelectorAll('.combined-images img');

// Function to show the next image and apply the zoom effect
function showNextImage() {
    // Get the currently visible image (with active class)
    var currentImageDiv = document.querySelector('.combined-images > div.active');
    
    // Get the next image div, loop back to the first if we are at the end
    var nextImageDiv = currentImageDiv.nextElementSibling || imageDivs[0];

    // Remove zoom effect and hide current image
    currentImageDiv.classList.remove('active');
    var currentImage = currentImageDiv.querySelector('img');
    if (currentImage) currentImage.classList.remove('zoom-effect'); // Remove zoom effect

    // Add zoom effect and show next image
    nextImageDiv.classList.add('active');
    var nextImage = nextImageDiv.querySelector('img');
    if (nextImage) nextImage.classList.add('zoom-effect'); // Apply zoom effect

    // Adjust the image scale based on their positions
    imageDivs.forEach(function(div, index) {
        if (index === 0) {
            div.style.transform = "scale(1.5)"; // The first image should be larger
        } else {
            div.style.transform = "scale(1)"; // The other images are normal size
        }
    });
}

// Initial setup: Hide all images except the first one and make it active
imageDivs.forEach(function(imageDiv, index) {
    if (index !== 0) {
        imageDiv.classList.remove('active'); // Initially hide all except the first
    } else {
        imageDiv.classList.add('active'); // Set the first image as active
    }
});

// Step 3: Set interval for automatic transition every 5 seconds (adjust timing as needed)
setInterval(showNextImage, 5000); // Transition every 5 seconds