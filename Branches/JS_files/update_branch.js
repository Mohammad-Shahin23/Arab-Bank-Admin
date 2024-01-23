var urlParams = new URLSearchParams(window.location.search);
 const id = urlParams.get('id');
 const city = urlParams.get('city');
 const country = urlParams.get('country');

 populateForm(id, city, country)



function populateForm(id,city, country) {
    
    console.log('ID from URL:', id);
    console.log('City from URL:', city);
    console.log('Country from URL:', country);

    console.log('Edit Row function called with ID:', id);
    fetch(`https://arabbank.azurewebsites.net/api/branch/getbranchById?branchid=${id}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(branch => {
        // Store the current branch data
        const branchIdElement = document.getElementById('branchId');
  
        const currentbranchData = branch[0];
        // console.log(currentbranchData);
        // console.log('branch ID Element:', branchIdElement);
        // console.log('branchNameElement:', document.getElementById('branchName'));
        // console.log('branchNameElement:', document.getElementById('cityName'));
        // console.log('branchNameElement:', document.getElementById('countryName'));
  
        // Populate the form with the existing branch data
  
        console.log(branchIdElement);
  
        
          // Set values for each form field
          
          branchIdElement.value = currentbranchData.id;
          document.getElementById('branchName').value = currentbranchData.branchName;
          document.getElementById('branchNameAr').value = currentbranchData.branchNameAr;
          document.getElementById('branchNumber').value = currentbranchData.branchNumber;
          document.getElementById('branchCity').value = currentbranchData.cityName;
          document.getElementById('branchCountry').value = currentbranchData.countryName;
          
  
          
      })
      .catch(error => console.error('Error fetching branch data:', error));
  }


function updatebranch(id, city, country) {
    console.log('ID from URL:', id);
    console.log('City from URL:', city);
    console.log('Country from URL:', country);
    console.log('Updating branch with ID:', id);
    console.log(country);

    // Fetch the updated data from the form
    const newData = {
        id: parseInt(document.getElementById('branchId').value, 10),
        branchName: document.getElementById('branchName').value,
        branchNameAr: document.getElementById('branchNameAr').value,
        branchNumber: document.getElementById('branchNumber').value,
        cityName: city,
        countryName: country,
    };

    console.log('New Data:', newData);

    const url = `https://arabbank.azurewebsites.net/api/branch/${id}`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`Failed to update data. Server responded with status: ${response.status}, Message: ${response.statusText}`);
            }

            return response.json();
        })
        .then(data => {
            console.log('Updated data:', data);
            alert('Branch data updated successfully!');
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


function closeForm() {
    window.location.href = 'branches.html';
  }

