// Define the loader element
const loader = document.getElementById('addLoader');

// Get the input values in the global scope
var branchNameInput = document.getElementById('branchName');
var branchNameARInput = document.getElementById('branchNameAR');
var branchNumberInput = document.getElementById('branchNumber');
var countryInput = document.getElementById('countryName');
var cityInput = document.getElementById('cityName');

// Validate Branch Name while typing
branchNameInput.addEventListener('input', function () {
  validateInput(
    branchNameInput,
    /^[A-Za-z0-9\s!@#$/\\]*$/, // Updated regex to include special characters
    'errorBranchName',
    'Branch name should contain only English letters, numbers, and special characters (!@#$/\\).'
  );
});

// Validate Branch Name (AR) while typing
branchNameARInput.addEventListener('input', function () {
  validateInput(
    branchNameARInput,
    /^[ء-ي\s!@#$/\\]*$/, // Updated regex to include special characters
    'errorBranchNameAR',
    'Branch name (AR) should contain only Arabic letters, no numbers or special characters (!@#$/\\).'
  );
});

// Validate Branch Number while typing
branchNumberInput.addEventListener('input', function () {
  validateInput(
    branchNumberInput,
    /^\d*$/, // This regex already allows only numbers
    'errorBranchNumber',
    'Branch number should contain only numbers.'
  );
});

// Validate Country while typing
countryInput.addEventListener('input', function () {
  validateInput(countryInput, /^.+$/, 'errorCountry', 'Country is required.');
});

// Validate City while typing
cityInput.addEventListener('input', function () {
  validateInput(cityInput, /^.+$/, 'errorCity', 'City is required.');
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
  window.location.href = 'branches.html';
}

function submitForm() {
  // Validate all inputs before submitting the form
  
  var isFormValid =
  validateInput(
    branchNameInput,
    /^[A-Za-z0-9\s!@#$/\\]*$/,
    'errorBranchName',
    'Branch name should contain only English letters, numbers, and special characters (!@#$/\\).'
  ) &&
  validateInput(
    branchNameARInput,
    /^[ء-ي\s!@#$/\\]*$/,
    'errorBranchNameAR',
    'Branch name (AR) should contain only Arabic letters, no numbers or special characters (!@#$/\\).'
  ) &&
  validateInput(
    branchNumberInput,
    /^\d*$/,
    'errorBranchNumber',
    'Branch number should contain only numbers.'
  ) &&
    validateInput(countryInput, /^.+$/, 'errorCountry', 'Country is required.') &&
    validateInput(cityInput, /^.+$/, 'errorCity', 'City is required.');

  // If any validation fails, do not submit the form
  if (!isFormValid) {
    return;
  }

  // Form is valid, proceed with submission
  const formData = {
    "id": 0,
    "branchName": branchNameInput.value,
    "branchNameAR": branchNameARInput.value,
    "branchNumber": branchNumberInput.value,
    "countryName": countryInput.value,
    "cityName": cityInput.value
  };

  fetch('https://arabbanktest.azurewebsites.net/api/branch', {
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
    window.location.href = 'branches.html';
    closeForm();
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error, e.g., display an error message
    alert('An error occurred while adding the branch.');
  });
}

fetchCountries();

const countrySelect = document.getElementById('countryName');
countrySelect.addEventListener('change', function () {
  fetchCities();
});

function fetchCountries() {
  loader.style.display = 'block'; // Show loader before fetching countries

  fetch('https://arabbanktest.azurewebsites.net/api/COUNTRY')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(countries => {
      const countrySelect = document.getElementById('countryName');
      countrySelect.innerHTML = '';

      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.countryName;
        option.textContent = country.countryName;
        countrySelect.appendChild(option);
      });

      fetchCities(); // Trigger fetchCities directly after fetching countries
    })
    .catch(error => console.error('Error fetching countries:', error))
    .finally(() => {
      loader.style.display = 'none'; // Hide loader after fetching countries
    });
}

async function fetchCities() {
  loader.style.display = 'block'; // Show loader before fetching cities

  const selectedCountry = document.getElementById('countryName').value;

  fetch('https://arabbanktest.azurewebsites.net/api/city/filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectedCountry)
  })
    .then(response => response.json())
    .then(data => {
      const cityDropdown = document.getElementById('cityName');
      cityDropdown.innerHTML = '';

      data.forEach((city, index) => {
        const option = document.createElement('option');
        option.value = city.cityName;
        option.textContent = city.cityName;
        cityDropdown.appendChild(option);

      });
    })
    .catch(error => console.error('Error fetching cities:', error))
    .finally(() => {
      loader.style.display = 'none'; // Hide loader after fetching cities
    });
}
