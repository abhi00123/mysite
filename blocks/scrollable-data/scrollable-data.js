document.addEventListener("DOMContentLoaded", function() {
  // Variables to store images and data
  const images = document.querySelectorAll('.clientimgouter');
  const dataSections = document.querySelectorAll('.scrollable-data');
  
  let activeIndex = 0; // Initially, first image and testimonial will be active
  
  // Function to activate the current image and data
  function activateContent(index) {
    // Remove active class from all images and data
    images.forEach(img => img.classList.remove('active-img'));
    dataSections.forEach(data => data.classList.remove('active-data'));

    // Add active class to the current image and data
    images[index].classList.add('active-img');
    dataSections[index].classList.add('active-data');
  }

  // Function to switch the content automatically every 5 seconds
  function switchContent() {
    activeIndex = (activeIndex + 1) % images.length; // Cycle through images
    activateContent(activeIndex);
  }

  // Initialize with the first image and data
  activateContent(activeIndex);

  // Set interval to switch content every 5 seconds
  setInterval(switchContent, 5000);
});
