// Get the input values in the global scope
var productNameInput = document.getElementById('productName');
var productNameARInput = document.getElementById('productNameAR');
var countryInput = document.getElementById('country');

// Validate Product Name while typing
productNameInput.addEventListener('input', function () {
  validateInput(
    productNameInput,
    /^[A-Z][a-zA-Z\s]*$/,
    'errorProductName',
    'Product name should start with a capital letter and contain no numbers.'
  );
});

// Validate Product Name (AR) while typing
productNameARInput.addEventListener('input', function () {
  validateInput(productNameARInput, /^[ء-ي\s]*$/, 'errorProductNameAR', 'Product name (AR) should contain only Arabic letters and no numbers or special characters.');
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

var urlParams = new URLSearchParams(window.location.search);


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


  populateForm(urlParams.get('id'));

  function populateForm(id) {
    console.log('Edit Row function called with ID:', id);
    fetch(`https://arabbanktest.azurewebsites.net/api/product/getproductById?productid=${id}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(product => {
        // Store the current product data
        const productIdElement = document.getElementById('productId');
        const currentproductData = product[0];
  
        // Populate the form with the existing product data
        productIdElement.value = currentproductData.id;
        document.getElementById('productName').value = currentproductData.productName;
        document.getElementById('productNameAR').value = currentproductData.prdouchNameAr;
  
        // Set the selected country after populating the options
        const countrySelect = document.getElementById('country');
        countrySelect.value = currentproductData.country;
  
      })
      .catch(error => console.error('Error fetching product data:', error));
  }

function closeForm() {
  window.location.href = 'products.html';
}

function updateProduct(id) {
  // Validate all inputs before updating the product
  var isFormValid =
    validateInput(productNameInput, /^[A-Z][a-zA-Z\s]*$/, 'errorProductName', 'Product name should start with a capital letter and contain no numbers.') &&
    validateInput(productNameARInput, /^[ء-ي\s]*$/, 'errorProductNameAR', 'Product name (AR) should contain only Arabic letters and no numbers or special characters.') &&
    validateInput(countryInput, /^.+$/, 'errorCountry', 'Country is required.');

  // If any validation fails, do not update the product
  if (!isFormValid) {
    return;
  }

  // Fetch the updated data from the form
  const newData = {
    id: parseInt(document.getElementById('productId').value, 10),
    productName: document.getElementById('productName').value,
    prdouchNameAr: document.getElementById('productNameAR').value,
    country: document.getElementById('country').value
  };

  const url = `https://arabbanktest.azurewebsites.net/api/product/${id}`;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update data. Server responded with status: ${response.status}, Message: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Updated data:', data);
      console.log('Product data updated successfully!');
      window.location.href = 'products.html';
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

      console.log('Failed to update product data.');
    });
}
