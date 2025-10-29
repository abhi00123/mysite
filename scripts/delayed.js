// add delayed functionality here
(() => {
  console.log('Injecting Adobe Launch (Development) script...');

  const script = document.createElement('script');
  script.src = 'https://assets.adobedtm.com/77e0831c0028/5835c188116e/launch-2f37ff2f2ecd-development.min.js';
  script.async = true;
  script.type = 'text/javascript';

  script.onload = () => console.log('✅ Adobe Launch Dev Script Loaded');
  script.onerror = () => console.error('❌ Failed to load Adobe Launch Dev Script');

  document.head.appendChild(script);
})();

