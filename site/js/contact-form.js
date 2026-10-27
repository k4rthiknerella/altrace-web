(function () {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var TO = 'rishi@altrace.io';
  var status = form.querySelector('.form-status');
  // No email service is configured, so the message goes from the visitor's
  // own email app, addressed and filled in from the form.
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var company = form.elements.company.value.trim();
    var body = 'Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + (company || '(not provided)') + '\n';
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Team chat request — ' + name) + '&body=' + encodeURIComponent(body);
    status.className = 'form-status success';
    status.innerHTML = 'Your email app should open with the message ready to send. If it doesn&apos;t, email us at <a href="mailto:' + TO + '">' + TO + '</a>.';
  });
}());
