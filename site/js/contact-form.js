(function () {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var status = form.querySelector('.form-status');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Sending…';
    status.className = 'form-status'; status.textContent = '';
    try {
      var response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.elements.name.value, email: form.elements.email.value, company: form.elements.company.value || undefined }) });
      var data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not send your message.');
      form.reset(); status.className = 'form-status success'; status.textContent = 'Thanks — we received your note and will reach out at the email you provided.';
    } catch (error) {
      status.className = 'form-status error'; status.textContent = error.message || 'Network error. Please try again.';
    }
    button.disabled = false; button.textContent = 'Send';
  });
}());
