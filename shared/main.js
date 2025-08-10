let lastCSS = null;
let lastJS = null;

function loadScreen(screenPath) {
  fetch(screenPath)
    .then(res => res.text())
    .then(html => {
      document.getElementById('app').innerHTML = html;

      // Load CSS cho màn
      const cssPath = screenPath.replace('.html', '.css');
      loadCSS(cssPath);

      // Load JS cho màn
      const jsPath = screenPath.replace('.html', '.js');
      loadScript(jsPath);
    })
    .catch(err => console.error('Lỗi load màn hình:', err));
}

function loadCSS(path) {
  if (lastCSS !== path) {
    // Gỡ CSS cũ nếu khác file
    const existing = document.querySelector(`link[data-screen-css]`);
    if (existing) existing.remove();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    link.setAttribute('data-screen-css', 'true');
    document.head.appendChild(link);

    lastCSS = path; // lưu lại
  }
}

function loadScript(path) {
  if (lastJS !== path) {
    // Gỡ script cũ nếu khác file
    const existing = document.querySelector(`script[data-screen-js]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    script.setAttribute('data-screen-js', 'true');
    document.body.appendChild(script);

    lastJS = path; // lưu lại
  }
}

// Tải màn hình home khi bắt đầu
loadScreen('screens/home/home.html');