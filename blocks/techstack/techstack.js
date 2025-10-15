// Get all div elements within the techstack-wrapper that are directly inside techstack block
const techStackDivs = document.querySelectorAll('.techstack-wrapper .techstack > div');

// Loop through each div and apply the correct classes
techStackDivs.forEach((div) => {
  // Check if the div contains a p tag (this will be the list div)
  if (div.querySelector('p')) {
    // Apply the 'techs' class to the outer div
    div.classList.add('techs');
    
    // Apply the 'list' class to the first div containing the p tag
    const firstDiv = div.querySelector('div');
    if (firstDiv) {
      firstDiv.classList.add('list');
    }

    // Apply the 'sublist' class to the next div (the sublist)
    const nextDiv = div.querySelector('div + div');
    if (nextDiv) {
      nextDiv.classList.add('sublist');
    }
  }
});

// Select all the 'list' divs (clickable tabs)
const listDivs = document.querySelectorAll('.techs .list');

// Add click event listener to each 'list' div
listDivs.forEach(list => {
  list.addEventListener('click', () => {
    // Close all sublists
    const allSublists = document.querySelectorAll('.techs .sublist');
    allSublists.forEach(sublist => sublist.classList.remove('show'));

    // Find the next sibling (sublist corresponding to the clicked list)
    const sublist = list.nextElementSibling;

    // Show the clicked sublist
    sublist.classList.add('show');
  });
});

// Ensure the first sublist is open by default
const firstTech = document.querySelector('.techs .list');
if (firstTech) {
  const firstSublist = firstTech.nextElementSibling;
  if (firstSublist) {
    firstSublist.classList.add('show');
  }
}
