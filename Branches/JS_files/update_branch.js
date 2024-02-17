

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

// Populate the form with data from the server
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const loader = document.getElementById('addLoader');
populateForm(id);

function populateForm(id) {
  console.log('Edit Row function called with ID:', id);
  fetch(`https://arabbanktest.azurewebsites.net/api/branch/getbranchById?branchid=${id}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(branch => {
      const currentbranchData = branch[0];

      // Populate the form with the existing branch data
      document.getElementById('branchId').value = currentbranchData.id;
      branchNameInput.value = currentbranchData.branchName;
      branchNameARInput.value = currentbranchData.branchNameAr;
      branchNumberInput.value = currentbranchData.branchNumber;
      countryInput.value = currentbranchData.countryName;
      cityInput.value = currentbranchData.cityName;
    })
    .catch(error => console.error('Error fetching branch data:', error));
}

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

function updateBranch(id) {
    // Validate all inputs before updating the branch
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
  
    // If any validation fails, do not update the branch
    if (!isFormValid) {
      return;
    }
  
    // Fetch the updated data from the form
    const newData = {
        id: id, // Use the ID directly, no need to parse it again
        branchName: branchNameInput.value,
        branchNameAr: branchNameARInput.value,
        branchNumber: branchNumberInput.value,
        cityName: cityInput.value,
        countryName: countryInput.value,
      };
    console.log('New Data:', newData);
  
    const url = `https://arabbanktest.azurewebsites.net/api/branch/${id}`;
  
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
    
      .then(response => {
        console.log('Response:', newData);
        if (response.status === 204) {
          console.log('Branch data updated successfully!');
          setTimeout(function () {
            
          }, 0);
        } else {
            alert(`Failed to update data. Server responded with status: ${response.status}, Message: ${response.statusText}`);
          throw new Error(`Failed to update data. Server responded with status: ${response.status}, Message: ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error('Error updating data:', error);
  
        // Check if the error is a Response object
        if (error instanceof Response) {
          // Log the response status and statusText
          console.error('Response status:', error.status);
          console.error('Response text:', error.statusText);
  
          // Attempt to parse the response as JSON
          error.json().then(errorData => {
            console.error('Response JSON:', errorData);
          }).catch(jsonError => {
            console.error('Error parsing response JSON:', jsonError);
          });
        }
      })
      .finally(() => {
        // Redirect to 'branches.html' regardless of the response or error
        window.location.href = 'branches.html';
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
