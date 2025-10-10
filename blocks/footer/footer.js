import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Select all children except the country container
  const countrySection = fragment.querySelector('.section.country-container');
  const otherNodes = [];
  Array.from(fragment.children).forEach(child => {
    if (!child.classList.contains('country-container')) {
      // Rename only the 'section' class to 'below-section'
      if (child.classList.contains('section')) {
        child.classList.replace('section', 'below-section');
      }
      otherNodes.push(child);
    }
  });

  // Clear the block and append the country container inside as the only content
  block.textContent = '';
  if (countrySection) {
    block.appendChild(countrySection);
  }

  // Move the other footer content outside the footer block (after)
  if (otherNodes.length > 0) {
    otherNodes.forEach(node => {
      block.parentNode.insertBefore(node, block.nextSibling);
    });
  }
}
