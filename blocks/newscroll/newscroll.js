// Select all testimonial divs (first 3) and image divs (last 3)
const allDivs = document.querySelectorAll('.newscroll-wrapper .newscroll.block > div');
const testimonials = Array.from(allDivs).slice(0, 3);
const images = Array.from(allDivs).slice(-3);

// Create combined-images container dynamically
const combinedDiv = document.createElement('div');
combinedDiv.classList.add('combined-images');
images.forEach(img => combinedDiv.appendChild(img));
document.querySelector('.newscroll-wrapper').appendChild(combinedDiv);

// Find initial active index
let currentIndex = testimonials.findIndex(div => div.classList.contains('active'));
if (currentIndex === -1) currentIndex = 0; // fallback if none active

// Ensure initial state
testimonials.forEach((t, i) => {
    if (i === currentIndex) {
        t.classList.add('active');
        t.classList.remove('hidden');
    } else {
        t.classList.remove('active');
        t.classList.add('hidden');
    }
});

// Function to rotate testimonial and reorder images
function showNext() {
    // Hide current testimonial
    testimonials[currentIndex].classList.remove('active');
    testimonials[currentIndex].classList.add('hidden');

    // Next index
    currentIndex = (currentIndex + 1) % testimonials.length;

    // Show next testimonial
    testimonials[currentIndex].classList.remove('hidden');
    testimonials[currentIndex].classList.add('active');

    // Move corresponding image to first position
    const activeImage = images[currentIndex];
    combinedDiv.insertBefore(activeImage, combinedDiv.firstChild);
}

// Auto-rotate every 5 seconds
setInterval(showNext, 5000);