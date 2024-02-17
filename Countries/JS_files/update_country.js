var urlParams = new URLSearchParams(window.location.search);
 populateForm(urlParams.get('id'))



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
 
 // Additional functions and code as needed
 
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
 

 function populateForm(id) {
    // Show the loader while waiting for data
    const updateLoader = document.getElementById('updateLoader');
    updateLoader.style.display = 'block';
  
    console.log('Edit Row function called with ID:', id);
    fetch(`https://arabbanktest.azurewebsites.net/api/country/getCountryById?countryid=${id}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(country => {
        // Store the current country data
        const countryIdElement = document.getElementById('countryId');
  
        const currentCountryData = country[0];
        console.log(currentCountryData);
        console.log('Country ID Element:', countryIdElement);
        console.log('countryNameElement:', document.getElementById('countryName'));
  
        // Populate the form with the existing country data
        console.log(countryIdElement);
  
        // Set values for each form field
        countryIdElement.value = currentCountryData.id;
        document.getElementById('countryName').value = currentCountryData.countryName;
        document.getElementById('countryNameAR').value = currentCountryData.countryNameAR;
        document.getElementById('countryCode').value = currentCountryData.countryCode;
        document.getElementById('mobileCode').value = currentCountryData.mobileCode;
        document.getElementById('countryMobileHint').value = currentCountryData.countryMobileHint;
        document.getElementById('countryCurrencyCode').value = currentCountryData.countryCurrencyCode;
        document.getElementById('countryCurrencyCodeAr').value = currentCountryData.countryCurrencyCodeAr;
  
        // Hide the loader after successful data retrieval
        updateLoader.style.display = 'none';
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
  
        // Hide the loader in case of an error
        updateLoader.style.display = 'none';
      });
  }


  function closeForm() {
    window.location.href = 'countries.html';
  }



  function updateCountry(id) {

     // Validate all inputs before updating the country
        var isFormValid =
        validateInput(countryNameInput, /^[A-Z][a-zA-Z\s]*$/, 'errorCountryName', 'Country name should start with a capital letter and contain no numbers.') &&
        validateInput(countryNameARInput, /^[ء-ي\s]*$/, 'errorCountryNameAR', 'Country name (AR) should contain only Arabic letters and no numbers or special characters.') &&
        validateInput(countryCodeInput, /^[A-Z\s]*$/, 'errorCountryCode', 'Country code should contain only capital letters and no numbers.') &&
        validateInput(mobileCodeInput, /^00\d+$/, 'errorMobileCode', 'Mobile code should contain only numbers and start with "00".') &&
        validateInput(countryMobileHintInput, /^.+$/, 'errorCountryMobileHint', 'Mobile Hint should not be empty.') &&
        validateInput(countryCurrencyCodeInput, /^[A-Z\s]+$/, 'errorCountryCurrencyCode', 'Currency code should contain only capital letters.') &&
        validateInput(countryCurrencyCodeArInput, /^[ء-ي\s]*$/, 'errorCountryCurrencyCodeAr', 'Currency code (AR) should contain only Arabic letters and no numbers.');

        // If any validation fails, do not update the country
        if (!isFormValid) {
        return;
        }
            
    console.log('Updating country with ID:', id);


    // Fetch the updated data from the form
    const newData = {
        id: parseInt(document.getElementById('countryId').value, 10),
        countryName: document.getElementById('countryName').value,
        countryNameAR: document.getElementById('countryNameAR').value,
        countryCode: document.getElementById('countryCode').value,
        mobileCode: document.getElementById('mobileCode').value,
        countryMobileHint: document.getElementById('countryMobileHint').value,
        countryCurrencyCode: document.getElementById('countryCurrencyCode').value,
        countryCurrencyCodeAr: document.getElementById('countryCurrencyCodeAr').value,
    };

    console.log('New Data:', newData);

    const url = `https://arabbanktest.azurewebsites.net/api/country/${id}`;

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
        
        window.location.href = 'countries.html';
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

        alert('Failed to update country data.');
    });
}