console.log('HU Form Enhancer content script loaded');

(function() {
  // 1. Inject UI if not present
  let hostForm = document.querySelector('.hu-form-card');
  if (!hostForm) {
    // Remove existing form nodes (assuming main content is a form)
    document.body.innerHTML = '';
    document.body.style.background = '#f5f9fc';
    // Card container
    hostForm = document.createElement('form');
    hostForm.className = 'hu-form-card';
    hostForm.autocomplete = 'off';
    hostForm.innerHTML = `
      <div>
        <label for="hu-tobe">To-be HU (S#########)</label>
        <input type="text" id="hu-tobe" class="hu-input-large" maxlength="10" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" />
      </div>
      <div>
        <label for="hu-plan">Plan-HU (P#########)</label>
        <input type="text" id="hu-plan" class="hu-input-large" maxlength="10" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" />
      </div>
      <!-- Buttons are removed for auto-submit; could add a cancel/clear if needed -->
    `;
    document.body.append(hostForm);
  }

  // 2. Success feedback element
  let msg = document.createElement('div');
  msg.className = 'hu-success-message';
  document.body.appendChild(msg);

  // 3. Input references
  const tobeHU = hostForm.querySelector('#hu-tobe');
  const planHU = hostForm.querySelector('#hu-plan');
  const huFields = [tobeHU, planHU];

  // 4. Patterns
  const RE_TOBE = /^S\d{9}$/i;
  const RE_PLAN = /^P\d{9}$/i;

  // Utility
  function validateInput(input, pattern) {
    return pattern.test(input.value.trim().toUpperCase());
  }

  function showValidation(input, isValid) {
    input.classList.remove('valid', 'invalid');
    if (input.value.length > 0) {
      input.classList.add(isValid ? 'valid' : 'invalid');
    }
  }

  // 5. Focus Management
  function nextField(curr) {
    if (curr === tobeHU && validateInput(tobeHU, RE_TOBE)) {
      planHU.focus();
      planHU.select();
    }
  }

  // 6. Form Validation and Autosubmit
  function checkAndSubmit() {
    const valid1 = validateInput(tobeHU, RE_TOBE);
    const valid2 = validateInput(planHU, RE_PLAN);
    if (valid1 && valid2) {
      submitForm();
    }
  }

  // 7. Submission Handler
  function submitForm() {
    const deliveryNumber = planHU.value.trim().toUpperCase();
    msg.textContent = `Success! Delivery: ${deliveryNumber}`;
    msg.classList.add('visible');
    // Reset after 3 seconds
    setTimeout(() => {
      msg.classList.remove('visible');
      hostForm.reset();
      huFields.forEach(f => f.classList.remove('valid', 'invalid'));
      tobeHU.focus();
    }, 3000);
  }

  // 8. Event Binding
  tobeHU.addEventListener('input', function() {
    showValidation(tobeHU, validateInput(tobeHU, RE_TOBE));
    nextField(tobeHU);
    checkAndSubmit();
  });

  planHU.addEventListener('input', function() {
    showValidation(planHU, validateInput(planHU, RE_PLAN));
    checkAndSubmit();
  });

  // Prevent default form submission
  hostForm.addEventListener('submit', e => e.preventDefault());

  // Autofocus first field
  tobeHU.focus();

  // Optional: Touch accessiblity improvement
  document.body.style.touchAction = "manipulation";
})();

