// Variable to store the current country data
document.addEventListener('DOMContentLoaded', function () {
  let currentCountryData;

  // Fetch data from the API
  fetch('https://arabbanktest.azurewebsites.net/api/country')
    .then(response => response.json())
    .then(data => {
      // Update the table with fetched data
      const tableBody = document.querySelector('#countryTable');

      console.log('Table Body:', tableBody);
      console.log('Fetched Data:', data);
      

      data.forEach(country => {
        const row = tableBody.insertRow();
        // console.log(country.id);
        row.innerHTML = `
          <td data-id="${country.id}">${country.id}</td>
          <td>${country.countryName}</td>
          <td>${country.countryNameAR}</td>
          <td>${country.countryCode}</td>
          <td>${country.mobileCode}</td>
          <td>${country.countryMobileHint}</td>
          <td>${country.countryCurrencyCodeAr}</td>
          <td>${country.countryCurrencyCode}</td>
          
          <td>
          <button type="button" id="editButton_${country.id}" class="btn btn-outline-primary" data-country-id="${country.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>

            <button type="button" id="deleteButton_${country.id}" class="btn btn-outline-danger" data-country-id="${country.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </td>
        `;
      });

    })
    .catch(error => console.error('Error fetching data:', error));

    
  // Add event listeners after the editRow function is defined
  // Add event listener to the table, using event delegation
  function  redirec_toUpdate(id){
    

      // Construct the new URL with the parameter
          var newUrl = `./update_country.html?id=${id}` ;

      // Redirect to the new URL
          window.location.href = newUrl;
  };




  const tableBody = document.querySelector('#countryTable');

  tableBody.addEventListener('click', function (event) {  
    console.log('Click event detected');
  
    const editButtonPrefix = 'editButton_';
    const deleteButtonPrefix = 'deleteButton_';
  
    const clickedButton = event.target.closest('button');
  
    if (clickedButton) {
      const clickedId = clickedButton.dataset.countryId;
      console.log('Clicked ID:', clickedId);
  
      if (clickedButton.id.startsWith(editButtonPrefix)) {
        console.log('Edit button clicked');
        redirec_toUpdate(clickedId);
      } else if (clickedButton.id.startsWith(deleteButtonPrefix)) {
        console.log('Delete button clicked');
        deleteRow(clickedId);
      } else {
        console.log("None were selected");
      }
    }
  });
  


  function deleteRow(id) {
    // Make a DELETE request to the server to delete the corresponding data
    fetch(`https://arabbanktest.azurewebsites.net/api/country?id=${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // If the server-side deletion is successful, remove the row from the DOM
          const row = document.querySelector(`#countryTable td[data-id="${id}"]`);
          if (row) {
            row.parentElement.remove(); // Remove the entire row
            console.log("Deleted successfully");
          } else {
            console.error('Row not found in the DOM');
          }
        } else {
          // Handle errors here if needed
          console.error('Error deleting data:', response.status);
        }
      })
      .catch(error => console.error('Error deleting data:', error));
  }
});
