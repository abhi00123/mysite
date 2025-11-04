// import { getMetadata } from '../../scripts/aem.js';
// import { loadFragment } from '../fragment/fragment.js';

// /**
//  * loads and decorates the footer
//  * @param {Element} block The footer block element
//  */
// export default async function decorate(block) {
//   // load footer as fragment
//   const footerMeta = getMetadata('footer');
//   const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
//   const fragment = await loadFragment(footerPath);

//   // Select all children except the country container
//   const countrySection = fragment.querySelector('.section.country-container');
//   const otherNodes = [];
//   Array.from(fragment.children).forEach(child => {
//     if (!child.classList.contains('country-container')) {
//       // Rename only the 'section' class to 'below-section'
//       if (child.classList.contains('section')) {
//         child.classList.replace('section', 'below-section');
//       }
//       otherNodes.push(child);
//     }
//   });

//   // Clear block and append only country section
//   block.textContent = '';
//   if (countrySection) {
//     block.appendChild(countrySection);
//   }

//   // Move remaining sections after the block
//   if (otherNodes.length > 0) {
//     otherNodes.forEach(node => {
//       block.parentNode.insertBefore(node, block.nextSibling);
//     });
//   }

//   // --- Footer Disclaimer Logic ---
//   const footerWrapper = block.closest('.footer-wrapper');
//   if (footerWrapper) {
//     const belowSections = footerWrapper.querySelectorAll('.below-section');
//     if (belowSections.length > 0) {
//       const lastBelowSection = belowSections[belowSections.length - 1];
//       if (lastBelowSection.textContent.includes('Bajaj Finserv Direct Limited')) {
//         const footerLast = document.createElement('div');
//         footerLast.className = 'footer-last';
//         footerLast.innerHTML = lastBelowSection.innerHTML;
//         footerWrapper.insertAdjacentElement('afterend', footerLast);
//         lastBelowSection.remove();
//       }
//     }
//   }

//   // --- 🌍 Country Hover Functionality ---
//   const addressBlock = document.querySelector('.address-main-footer.block');
//   if (addressBlock) {
//     const countryTabs = addressBlock.querySelectorAll(':scope > div:nth-child(1) p');
//     const countryGroups = addressBlock.querySelectorAll(':scope > div.country-group');

//     countryTabs.forEach((tab, index) => {
//       tab.addEventListener('mouseenter', () => {
//         countryTabs.forEach(t => t.classList.remove('active'));
//         countryGroups.forEach(g => g.classList.remove('active'));
//         tab.classList.add('active');
//         countryGroups[index].classList.add('active');
//       });
//     });

//     // Default active country (India)
//     if (countryTabs.length > 0) {
//       countryTabs[0].classList.add('active');
//       countryGroups[0].classList.add('active');
//     }
//   }
// }


import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer with a 2-div country tab/panel layout.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Handle non-country-container sections
  const countrySection = fragment.querySelector('.section.country-container');
  const otherNodes = [];
  Array.from(fragment.children).forEach((child) => {
    if (!child.classList.contains('country-container')) {
      if (child.classList.contains('section')) {
        child.classList.replace('section', 'below-section');
      }
      otherNodes.push(child);
    }
  });

  // Replace block content and append sections
  block.textContent = '';
  if (countrySection) block.appendChild(countrySection);
  if (otherNodes.length > 0) {
    otherNodes.forEach((node) => {
      block.parentNode.insertBefore(node, block.nextSibling);
    });
  }

  // Footer Disclaimer logic
  const footerWrapper = block.closest('.footer-wrapper');
  if (footerWrapper) {
    const belowSections = footerWrapper.querySelectorAll('.below-section');
    if (belowSections.length > 0) {
      const lastBelowSection = belowSections[belowSections.length - 1];
      if (lastBelowSection.textContent.includes('Bajaj Finserv Direct Limited')) {
        const footerLast = document.createElement('div');
        footerLast.className = 'footer-last';
        footerLast.innerHTML = lastBelowSection.innerHTML;
        footerWrapper.insertAdjacentElement('afterend', footerLast);
        lastBelowSection.remove();
      }
    }
  }

  // ===== Two-div tab/panel restructuring logic =====
  const addressBlock = document.querySelector('.address-main-footer.block');
  if (addressBlock) {
    // Collect all original country wrappers
    const countryDivs = Array.from(addressBlock.querySelectorAll(':scope > div'));
    if (countryDivs.length === 0) return;

    // Create one tab row and one panel row
    const tabRow = document.createElement('div');
    tabRow.className = 'address-tabs-row';
    const panelRow = document.createElement('div');
    panelRow.className = 'address-panels-row';

    const countryClassNames = ['india', 'uae', 'usa'];

    countryDivs.forEach((countryDiv, idx) => {
      const tab = countryDiv.querySelector(':scope > div:first-child h2');
      if (tab) {
        tab.id = countryClassNames[idx];
        tabRow.appendChild(tab);
      }

      const panelContent = countryDiv.querySelector(':scope > div:last-child');
      if (panelContent) {
        const panel = document.createElement('div');
        panel.className = countryClassNames[idx] || '';
        panel.appendChild(panelContent);
        panelRow.appendChild(panel);
      }
    });

    // Replace original layout with tab/panel structure
    addressBlock.innerHTML = '';
    addressBlock.appendChild(tabRow);
    addressBlock.appendChild(panelRow);

    // ---- Tab/Panel activation logic ----
    const tabs = countryClassNames
      .map((cls) => tabRow.querySelector(`h2#${cls}`))
      .filter(Boolean);
    const panels = countryClassNames
      .map((cls) => panelRow.querySelector(`.${cls}`))
      .filter(Boolean);

    function activateTab(idx) {
      tabs.forEach((tab, i) => tab.classList.toggle('active', i === idx));
      panels.forEach((panel, i) => panel.classList.toggle('visible', i === idx));
    }

    tabs.forEach((tab, idx) => {
      tab.addEventListener('mouseenter', () => activateTab(idx));
      tab.addEventListener('click', () => activateTab(idx));
    });

    // Default active (India)
    activateTab(0);
  }
}
