(function () {
  // Each booking button is a plain link to the Calendly page that opens in a
  // new tab. Once Calendly's widget script has loaded, a click opens its
  // popup instead; if the script never loads, the link still works.
  var links = document.querySelectorAll('a[data-calendly]');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!window.Calendly || typeof window.Calendly.initPopupWidget !== 'function') return;
      event.preventDefault();
      window.Calendly.initPopupWidget({ url: this.href });
    });
  }
}());
