// Get all div elements within the carouselnew block, targeting only inner divs
const carouselItems = document.querySelectorAll('.carouselnew > div');

// Loop through each div and apply the correct structure using innerHTML
carouselItems.forEach((item, index) => {
  // Add the 'carousel-item' class to each item
  item.classList.add('carousel-item');

  // Extract the content of text, stats, and image
  const textContent = item.querySelector('div:nth-child(1)').innerHTML || '';
  const statsContent = item.querySelector('div:nth-child(2)').innerHTML || '';
  const imageContent = item.querySelector('div:nth-child(3)').innerHTML || '';

  // Construct the new HTML structure for the item
  item.innerHTML = `
    <div>
      <div class="text-content">
        ${textContent}
      </div>
      <div class="stats">
        ${statsContent}
      </div>
    </div>
    <div>
      <div class="image-content">
        ${imageContent}
      </div>
    </div>
  `;

  // Apply classes inside the new structure using innerHTML
  const textDiv = item.querySelector('.text-content');
  if (textDiv) {
    // Apply title, description, and read-more classes to respective elements
    const title = textDiv.querySelector('p:nth-child(1)');
    if (title) title.classList.add('title');

    const description = textDiv.querySelector('p:nth-child(2)');
    if (description) description.classList.add('description');
  }

  const imageDiv = item.querySelector('.image-content');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) img.classList.add('carousel-image');
  }

  const statsDiv = item.querySelector('.stats');
  if (statsDiv) {
    const statElements = statsDiv.querySelectorAll('p');
    statElements.forEach((stat) => {
      stat.classList.add('stat');
      const number = stat.querySelector('span:nth-child(1)');
      if (number) number.classList.add('number');

      const label = stat.querySelector('span:nth-child(2)');
      if (label) label.classList.add('label');
      
          if (statElements.length > 0) {
      // Change the class of the last <p> tag to 'read-more'
      const lastStat = statElements[statElements.length - 1];
      lastStat.classList.remove('stat'); // Remove the 'stat' class
      lastStat.classList.add('read-more'); // Add the 'read-more' class
    }
    });
  }
});

