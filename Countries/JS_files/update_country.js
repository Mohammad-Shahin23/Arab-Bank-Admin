var urlParams = new URLSearchParams(window.location.search);
 populateForm(urlParams.get('id'))


function populateForm(id) {
    console.log('Edit Row function called with ID:', id);
    fetch(`https://arabbank.azurewebsites.net/api/country/getCountryById?countryid=${id}`, {
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
  
          
      })
      .catch(error => console.error('Error fetching country data:', error));
  }

//   function updateCountry(id) {
//     console.log(id);

//     // Fetch the updated data from the form
//     const updatedData = {
//         countryId: document.getElementById('countryId').value,
//         countryName: document.getElementById('countryName').value,
//         countryNameAR: document.getElementById('countryNameAR').value,
//         countryCode: document.getElementById('countryCode').value,
//         mobileCode: document.getElementById('mobileCode').value,
//         countryMobileHint: document.getElementById('countryMobileHint').value,
//         countryCurrencyCode: document.getElementById('countryCurrencyCode').value,
//         countryCurrencyCodeAr: document.getElementById('countryCurrencyCodeAr').value,
//     };

//     // Create a simplified payload with only the countryId
//     const simplifiedData = {
//         countryId: updatedData.countryId,
//     };
  
//     // Make a PUT request to update the country data with the simplified payload
//     fetch(`https://arabbank.azurewebsites.net/api/CountrY/${simplifiedData.countryId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(simplifiedData),
//     })
//     .then(response => {
//         // Log the entire response for more details
//         console.log('Response:', response);

//         if (response && response.ok) {
//             // If the server-side update is successful, close the form
//             closeForm();
//         } else {
//             // Log the response text for more details
//             response.text().then(text => console.error('Response Text:', text));
//             // Handle errors here if needed
//             console.error('Error updating data:', response.status);
//         }
//     })
//     .catch(error => console.error('Error updating data:', error));
// }


  function closeForm() {
    window.location.href = 'countries.html';
  }



  function updateCountry(id) {
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

    const url = `https://arabbank.azurewebsites.net/api/CountrY/${id}`;

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
        alert('Country data updated successfully!');
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