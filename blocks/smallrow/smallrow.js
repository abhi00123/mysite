document.querySelectorAll('.section.smallrow-container .default-content-wrapper p').forEach((pTag) => {
    const words = pTag.textContent.trim().split(/\s+/);
    pTag.innerHTML = words
      .map((word, index) => `<span class="word${index + 1}">${word}</span>`)
      .join(' ');
});

const highlightPhrases = [
  "Join hands",
  "Bajaj Technology Services",
  "digital transformation."
];

// Step 1: Wrap words in spans
document.querySelectorAll('.section.smallrow-container .default-content-wrapper p').forEach((pTag) => {
    const words = pTag.textContent.trim().split(/\s+/);
    pTag.innerHTML = words
      .map((word, index) => `<span class="word${index + 1}">${word}</span>`)
      .join(' ');
});

const spans = Array.from(document.querySelectorAll('.section.smallrow-container .default-content-wrapper span'));

// Step 2: Mark highlight phrases
const highlightGroups = []; // store arrays of span groups
highlightPhrases.forEach(phrase => {
  const phraseWords = phrase.split(' ');
  for (let i = 0; i <= spans.length - phraseWords.length; i++) {
    const match = phraseWords.every((word, j) => spans[i + j].textContent === word);
    if (match) {
      const group = [];
      phraseWords.forEach((_, j) => {
        spans[i + j].classList.add('highlight');
        group.push(spans[i + j]);
      });
      highlightGroups.push(group);
    }
  }
});

// Step 3: Scroll-based reveal
function updateSpanVisibility() {
  const triggerOffset = window.innerHeight * 0.8;

  spans.forEach(span => {
    const rect = span.getBoundingClientRect();
    if (rect.top < triggerOffset && rect.bottom > 0.8) {
      span.classList.add('visible');
    } else {
      span.classList.remove('visible');
      span.classList.remove('reveal'); // reset reveal on scroll out
    }
  });

  // Animate highlight groups word-by-word
  highlightGroups.forEach(group => {
    const firstSpan = group[0];
    const rect = firstSpan.getBoundingClientRect();
    if (rect.top < triggerOffset && rect.bottom > 0) {
      group.forEach((span, index) => {
        setTimeout(() => {
          span.classList.add('reveal');
        }, index * 300); // 300ms delay between words
      });
    }
  });
}

window.addEventListener('scroll', updateSpanVisibility);
window.addEventListener('resize', updateSpanVisibility);
updateSpanVisibility(); // initial call
