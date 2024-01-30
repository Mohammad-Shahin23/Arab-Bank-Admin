var urlParams = new URLSearchParams(window.location.search);
 populateForm(urlParams.get('id'))


function populateForm(id) {
    console.log('Edit Row function called with ID:', id);
       fetch(`https://arabbank.azurewebsites.net/api/city/getcityById?cityid=${id}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(city => {
        // Store the current city data
        const cityIdElement = document.getElementById('cityId');
  
        const currentcityData = city[0];
        console.log(currentcityData);
        console.log('city ID Element:', cityIdElement);
        console.log('cityNameElement:', document.getElementById('cityName'));
  
        // Populate the form with the existing city data
  
        console.log(cityIdElement);
  
        
          // Set values for each form field
          
          cityIdElement.value = currentcityData.id;
          document.getElementById('cityName').value = currentcityData.cityName;
          document.getElementById('cityNameAR').value = currentcityData.cityNameAR;
          document.getElementById('country').value = currentcityData.country;
          
  
          
      })
      .catch(error => console.error('Error fetching city data:', error));
  }




  function closeForm() {
    window.location.href = 'cities.html';
  }



  function updatecity(id) {
    console.log('Updating city with ID:', id);

    // Fetch the updated data from the form
    const newData = {
        id: parseInt(document.getElementById('cityId').value, 10),
        cityName: document.getElementById('cityName').value,
        cityNameAR: document.getElementById('cityNameAR').value,
        country: document.getElementById('country').value,
        
    };

    console.log('New Data:', newData);

    const url = `https://arabbank.azurewebsites.net/api/city/${id}`;

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
        
        window.location.href = 'cities.html';
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

        alert('Failed to update city data.');
    });
}