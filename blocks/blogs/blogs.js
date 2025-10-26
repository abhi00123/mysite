export default function decorate(block) {
  const wrapper = block.parentElement;
  const scrollAmount = 344; // Card width (320px) + gap (24px)
  
  // Handle click on pseudo-element arrows
  wrapper.addEventListener('click', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    
    // Check if click is on left arrow area (::before)
    if (clickX < 60) {
      block.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
    
    // Check if click is on right arrow area (::after)
    if (clickX > rect.width - 60) {
      block.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  });
  
  console.log('✅ Scroll functionality added to CSS arrows');
}