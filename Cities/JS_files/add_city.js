// Fetch countries and populate the select element
const countrySelect = document.getElementById('country');

fetch('https://arabbanktest.azurewebsites.net/api/COUNTRY')
  .then(response => response.json())
  .then(countries => {
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.countryName;
      option.textContent = country.countryName;
      countrySelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching countries:', error);
  });



// Get the input values in the global scope
var cityNameInput = document.getElementById('cityName');
var cityNameARInput = document.getElementById('cityNameAR');
var countryInput = document.getElementById('country');

// Validate City Name while typing
cityNameInput.addEventListener('input', function () {
  validateInput(
    cityNameInput,
    /^[A-Za-z0-9\s]*$/,
    'errorCityName',
    'City name should contain only English letters and numbers.'
  );
});

// Validate City Name (AR) while typing
cityNameARInput.addEventListener('input', function () {
  validateInput(cityNameARInput, /^[ء-ي\s]*$/, 'errorCityNameAR', 'City name (AR) should contain only Arabic letters and no numbers or special characters.');
});

// Validate Country while typing
countryInput.addEventListener('input', function () {
  validateInput(countryInput, /^.+$/, 'errorCountry', 'Country is required.');
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
  window.location.href = 'cities.html';
}
 

function submitForm() {
  // Validate all inputs before submitting the form
  var isFormValid =
    validateInput(cityNameInput, /^[A-Z][a-zA-Z\s]*$/, 'errorCityName', 'City name should start with a capital letter and contain no numbers.') &&
    validateInput(cityNameARInput, /^[ء-ي\s]*$/, 'errorCityNameAR', 'City name (AR) should contain only Arabic letters and no numbers or special characters.') &&
    validateInput(countryInput, /^.+$/, 'errorCountry', 'Country is required.');

  // If any validation fails, do not submit the form
  if (!isFormValid) {
    return;
  }

  // Form is valid, proceed with submission
  const formData = {
    "id": 0,
    "cityName": cityNameInput.value,
    "cityNameAR": cityNameARInput.value,
    "country": countryInput.value
  };

  fetch('https://arabbanktest.azurewebsites.net/api/city', {
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
    window.location.href = 'cities.html';
    closeForm();
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error, e.g., display an error message
    alert('An error occurred while adding the city.');
  });
}
