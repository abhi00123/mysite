export default function decorate(block) {
  const techstackBlock = block;
  if (!techstackBlock) return;

  // Step 1: Add 'techs', 'list', and 'sublist' classes dynamically like your old JS
  const techStackDivs = techstackBlock.querySelectorAll(':scope > div');

  techStackDivs.forEach((div) => {
    if (div.querySelector('p')) {
      div.classList.add('techs');

      const firstDiv = div.querySelector('div');
      if (firstDiv) {
        firstDiv.classList.add('list');
      }

      const nextDiv = div.querySelector('div + div');
      if (nextDiv) {
        nextDiv.classList.add('sublist');
      }
    }
  });

  // Step 2: Ensure central containers exist
  let listsContainer = techstackBlock.querySelector('.lists');
  let panelsContainer = techstackBlock.querySelector('.panels');

  if (!listsContainer) {
    listsContainer = document.createElement('div');
    listsContainer.className = 'lists';
    techstackBlock.insertBefore(listsContainer, techstackBlock.firstChild);
  }

  if (!panelsContainer) {
    panelsContainer = document.createElement('div');
    panelsContainer.className = 'panels';
    techstackBlock.appendChild(panelsContainer);
  }

  // Step 3: Move each list/sublist pair into centralized containers
  const techGroups = Array.from(techstackBlock.querySelectorAll(':scope > .techs'));
  const normalizeKey = (str) => str.trim().toLowerCase().replace(/\s+/g, '-');

  techGroups.forEach(group => {
    const listEl = group.querySelector(':scope > .list');
    const sublistEl = group.querySelector(':scope > .sublist');
    if (!listEl || !sublistEl) {
      group.remove();
      return;
    }

    const key = normalizeKey(listEl.textContent);
    listEl.dataset.key = key;
    sublistEl.dataset.key = key;

    listsContainer.appendChild(listEl);
    panelsContainer.appendChild(sublistEl);
    group.remove();
  });

  // Step 4: Tab interaction logic (same behavior as your old click-based show/hide)
  const tabs = Array.from(listsContainer.querySelectorAll('.list'));
  const panels = Array.from(panelsContainer.querySelectorAll('.sublist'));

  function activateTab(key) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.key === key));
    panels.forEach(p => p.classList.toggle('show', p.dataset.key === key));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.key));
  });

  // Step 5: Show first sublist by default
  if (tabs.length) activateTab(tabs[0].dataset.key);
}
