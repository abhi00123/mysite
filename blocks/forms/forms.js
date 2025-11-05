function randomCaptcha(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
}

export default function decorate(block) {
  // Wait until EDS fully loads content inside the block
  const rows = block.querySelectorAll(':scope > div');

  rows.forEach((row) => {
    const label = row.children[0]?.innerText?.trim();

    // --- Name field ---
    if (label === 'Name *') {
      const inputDiv = row.children[1];
      inputDiv.innerHTML = '<input type="text" class="input name-input" name="name" required />';
    }

    // --- Email field ---
    if (label === 'Email *') {
      const inputDiv = row.children[1];
      inputDiv.innerHTML = '<input type="email" class="input email-input" name="email" required />';
    }

    // --- Captcha ---
    for (let i = 0; i < row.children.length - 1; i++) {
      if (
        row.children[i].innerText?.trim() === 'Captcha *' &&
        row.children[i + 1].innerText?.trim() === '[ ]'
      ) {
        const inputDiv = row.children[i + 1];
        inputDiv.innerHTML = `
          <span class="captcha-code"></span>
          <button class="refresh-btn" type="button">&#8635;</button>
          <input type="text" class="input captcha-input" name="captcha" required />
        `;

        const codeSpan = inputDiv.querySelector('.captcha-code');
        const refreshBtn = inputDiv.querySelector('.refresh-btn');
        const setCaptcha = () => (codeSpan.textContent = randomCaptcha());
        setCaptcha();
        refreshBtn.addEventListener('click', setCaptcha);
      }
    }

    // --- Message field ---
    if (label === 'Message') {
      const inputDiv = row.children[1];
      inputDiv.innerHTML = '<textarea class="input message-input" name="message" rows="4" required></textarea>';
    }

    // --- Privacy checkbox ---
    if (label && label.startsWith('[')) {
      const checkboxText = label.replace('[ ]', '').trim();
      row.children[0].innerHTML = `
        <label class="privacy-label">
          <input type="checkbox" class="privacy-checkbox" name="privacy" required />
          ${checkboxText}
        </label>
      `;
    }

    // --- Submit button ---
    if (label === 'Submit') {
      row.children[0].innerHTML = `<button type="submit" class="submit-button">Submit</button>`;
    }
  });

  // --- Form validation ---
  const form = block.closest('form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    const name = form.querySelector('input.name-input');
    const email = form.querySelector('input.email-input');
    const captchaInput = form.querySelector('input.captcha-input');
    const captchaCode = form.querySelector('.captcha-code');
    const privacyCheckbox = form.querySelector('input.privacy-checkbox');

    const emailReg = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

    if (!name?.value.trim()) {
      alert('Please enter your name.');
      event.preventDefault();
      return;
    }

    if (!emailReg.test(email?.value.trim())) {
      alert('Please enter a valid email address.');
      event.preventDefault();
      return;
    }

    if (!captchaInput?.value.trim()) {
      alert('Please enter the captcha.');
      event.preventDefault();
      return;
    }

    if (captchaInput.value.trim() !== captchaCode?.textContent.trim()) {
      alert('Captcha does not match. Please try again.');
      event.preventDefault();
      return;
    }

    if (!privacyCheckbox?.checked) {
      alert('You must agree to the privacy policy.');
      event.preventDefault();
    }
  });
}
