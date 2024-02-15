
// Get the input values in the global scope
var countryNameInput = document.getElementById('countryName');
var countryCodeInput = document.getElementById('countryCode');
var countryNameARInput = document.getElementById('countryNameAR');
var mobileCodeInput = document.getElementById('mobileCode');
var countryCurrencyCodeInput = document.getElementById('countryCurrencyCode');
var countryCurrencyCodeArInput = document.getElementById('countryCurrencyCodeAr');
var countryMobileHintInput = document.getElementById('countryMobileHint');


// Validate Country Name while typing
countryNameInput.addEventListener('input', function () {
  validateInput(countryNameInput, /^[A-Z][a-zA-Z\s]*$/, 'errorCountryName', 'Country name should start with a capital letter and contain no numbers.');
});

// Validate Country Name (AR) while typing
countryNameARInput.addEventListener('input', function () {
  validateInput(countryNameARInput, /^[ء-ي\s]*$/, 'errorCountryNameAR', 'Country name (AR) should contain only Arabic letters and no numbers or special characters.');
});

// Validate Country Code while typing
countryCodeInput.addEventListener('input', function () {
  validateInput(countryCodeInput, /^[A-Z\s]*$/, 'errorCountryCode', 'Country code should contain only capital letters and no numbers.');
});

// Validate Mobile Code while typing
mobileCodeInput.addEventListener('input', function () {
  validateInput(mobileCodeInput, /^00\d+$/, 'errorMobileCode', 'Mobile code should contain only numbers and start with "00".');
});

countryMobileHintInput.addEventListener('input', function () {
  validateInput(countryMobileHintInput, /^.+$/, 'errorCountryMobileHint', 'Mobile Hint should not be empty.');
});

// Validate Currency Code while typing
countryCurrencyCodeInput.addEventListener('input', function () {
  validateInput(countryCurrencyCodeInput, /^[A-Z\s]+$/, 'errorCountryCurrencyCode', 'Currency code should contain only capital letters.');
});

// Validate Currency Code (AR) while typing
countryCurrencyCodeArInput.addEventListener('input', function () {
  validateInput(countryCurrencyCodeArInput, /^[ء-ي\s]*$/, 'errorCountryCurrencyCodeAr', 'Currency code (AR) should contain only Arabic letters and no numbers.');
});


function validateInput(inputElement, regex, errorElementId, errorMessage) {
  // Check if the input is empty
  if (inputElement.value.trim() === '') {
    // Display an error message for empty input
    document.getElementById(errorElementId).innerHTML = 'This field is required.';
    return false;
  }

  // Check if the input matches the provided regex
  if (!regex.test(inputElement.value)) {
    // Display an error message
    document.getElementById(errorElementId).innerHTML = errorMessage;
    return false;
  } else {
    // Clear the error message
    document.getElementById(errorElementId).innerHTML = '';
    return true;
  }
}
function closeForm() {
  window.location.href = 'countries.html';
}

function submitForm() {
  // Get the input values
  var countryNameInput = document.getElementById('countryName');
  var countryCodeInput = document.getElementById('countryCode');
  var countryNameARInput = document.getElementById('countryNameAR');
  var mobileCodeInput = document.getElementById('mobileCode');
  var countryMobileHintInput = document.getElementById('countryMobileHint');
  var countryCurrencyCodeInput = document.getElementById('countryCurrencyCode');
  var countryCurrencyCodeArInput = document.getElementById('countryCurrencyCodeAr');

  // Validate all inputs before submitting the form
  var isFormValid =
    validateInput(countryNameInput, /^[A-Z][a-zA-Z\s]*$/, 'errorCountryName', 'Country name should start with a capital letter and contain no numbers.') &&
    validateInput(countryNameARInput, /^[ء-ي\s]*$/, 'errorCountryNameAR', 'Country name (AR) should contain only Arabic letters and no numbers or special characters.') &&
    validateInput(countryCodeInput, /^[A-Z\s]*$/, 'errorCountryCode', 'Country code should contain only capital letters and no numbers.') &&
    validateInput(mobileCodeInput, /^00\d+$/, 'errorMobileCode', 'Mobile code should contain only numbers and start with "00".') &&
    validateInput(countryMobileHintInput, /^.+$/, 'errorCountryMobileHint', 'Mobile Hint should not be empty.') &&
    validateInput(countryCurrencyCodeInput, /^[A-Z\s]+$/, 'errorCountryCurrencyCode', 'Currency code should contain only capital letters.') &&
    validateInput(countryCurrencyCodeArInput, /^[ء-ي\s]*$/, 'errorCountryCurrencyCodeAr', 'Currency code (AR) should contain only Arabic letters and no numbers.');

  // If any validation fails, do not submit the form
  if (!isFormValid) {
    return;
  }

  // Form is valid, proceed with submission
  const formData = {
    "id": 0,
    "countryName": document.getElementById('countryName').value,
    "countryNameAR": document.getElementById('countryNameAR').value,
    "countryCode": document.getElementById('countryCode').value,
    "mobileCode": document.getElementById('mobileCode').value,
    "countryMobileHint": document.getElementById('countryMobileHint').value,
    "countryCurrencyCode": document.getElementById('countryCurrencyCode').value,
    "countryCurrencyCodeAr": document.getElementById('countryCurrencyCodeAr').value
  };

  fetch('https://arabbanktest.azurewebsites.net/api/country', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response from the API, e.g., display a success message

    // Optionally, you can navigate to the specified page after successful submission
    window.location.href = 'countries.html';
    closeForm();
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error, e.g., display an error message
    alert('An error occurred while adding the country.');
  });
}
