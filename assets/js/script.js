function includeHTML(selector, url) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      setActiveNavLink(selector);
    })
    .catch(error => {
      console.error('Error including HTML:', error);
    });
}

// Set active class on nav-link based on current URL
function setActiveNavLink(containerSelector) {
  // Wait for DOM update
  setTimeout(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const links = container.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    links.forEach(link => {
      // Remove any existing 'active'
      link.classList.remove('active');
      // Compare href (last part) to current page
      let href = link.getAttribute('href')
      if(href.startsWith('.')) href = href.slice(1) //handles hrefs which begin with '.'
      console.log(href)
      if (currentPath.includes(href) && currentPath != '' && href != '/') {
        link.classList.add('active');
      }
      // Special case for homepage or #
      if ((currentPath === 'index.html' || currentPath === '/') && (href === '/' || href === '#')) {
        link.classList.add('active');
      }
    });
  }, 0);
}

// Load header as soon as .header-include appears in the DOM
(function watchHeaderInclude() {
  const tryIncludeHeader = () => {
    const header = document.querySelector('.header-include');
    if (header && !header.dataset.loaded) {
      includeHTML('.header-include', './__header.html');
      header.dataset.loaded = "true";
      return true;
    }
    return false;
  };
  if (!tryIncludeHeader()) {
    const observer = new MutationObserver(() => {
      if (tryIncludeHeader()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

// Automatically include footer if .footer-include exists
document.addEventListener('DOMContentLoaded', function() {
  const footer = document.querySelector('.footer-include');
  if (footer) {
    includeHTML('.footer-include', './__footer.html');
  }
});

// Initialize WOW.js for animations
new WOW().init();