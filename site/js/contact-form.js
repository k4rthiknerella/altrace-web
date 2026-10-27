(function () {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var TO = 'rishi@altrace.io';
  var status = form.querySelector('.form-status');
  // The message is sent by /api/contact (Resend, to rishi@altrace.io). When
  // that is not set up or cannot be reached, the visitor's own email app is
  // opened with the message filled in instead, so a request is never lost.
  function mailto(name, email, company) {
    var body = 'Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + (company || '(not provided)') + '\n';
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Team chat request — ' + name) + '&body=' + encodeURIComponent(body);
    status.className = 'form-status';
    status.innerHTML = 'We couldn&apos;t send it from here, so your email app should open with the message ready to send. If it doesn&apos;t, email us at <a href="mailto:' + TO + '">' + TO + '</a>.';
  }
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var company = form.elements.company.value.trim();
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Sending…';
    status.className = 'form-status'; status.textContent = '';
    try {
      var response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, email: email, company: company || undefined }) });
      if (response.ok) {
        form.reset();
        status.className = 'form-status success';
        status.textContent = 'Thanks — we received your note and will reach out at the email you provided.';
      } else if (response.status === 400) {
        var data = await response.json().catch(function () { return {}; });
        status.className = 'form-status error';
        status.textContent = data.error || 'Please check your name and email.';
      } else {
        mailto(name, email, company);
      }
    } catch (error) {
      mailto(name, email, company);
    }
    button.disabled = false; button.textContent = 'Send';
  });
}());
