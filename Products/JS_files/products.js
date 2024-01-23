// Variable to store the current product data
document.addEventListener('DOMContentLoaded', function () {
  let currentproductData;

  // Fetch data from the API
  fetch('https://arabbank.azurewebsites.net/api/product')
    .then(response => response.json())
    .then(data => {
      // Update the table with fetched data
      const tableBody = document.querySelector('#productTable');

      console.log('Table Body:', tableBody);
      console.log('Fetched Data:', data);
      

      data.forEach(product => {
        const row = tableBody.insertRow();
        // console.log(product.id);
        row.innerHTML = `
          <td data-id="${product.id}">${product.id}</td>
          <td>${product.productName}</td>
          <td>${product.prdouchNameAr}</td>
          <td>${product.country}</td>
          
          <td>
          <button type="button" id="editButton_${product.id}" class="btn btn-outline-primary" data-product-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>

            <button type="button" id="deleteButton_${product.id}" class="btn btn-outline-danger" data-product-id="${product.id}">
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
          var newUrl = `./update_products.html?id=${id}` ;

      // Redirect to the new URL
          window.location.href = newUrl;
  };




  const tableBody = document.querySelector('#productTable');

  tableBody.addEventListener('click', function (event) {  
    console.log('Click event detected');
  
    const editButtonPrefix = 'editButton_';
    const deleteButtonPrefix = 'deleteButton_';
  
    const clickedButton = event.target.closest('button');
  
    if (clickedButton) {
      const clickedId = clickedButton.dataset.productId;
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
    fetch(`https://arabbank.azurewebsites.net/api/product?id=${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // If the server-side deletion is successful, remove the row from the DOM
          const row = document.querySelector(`#productTable td[data-id="${id}"]`);
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


function fetchCities() {
  const selectedproduct = document.getElementById('countrySlec').value;

  if (!selectedproduct) {
      // If no product is selected, do nothing
      return;
  }

  console.log('Request Payload:', JSON.stringify(selectedproduct));

  fetch('https://arabbank.azurewebsites.net/api/Product/GetProductByCountry', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedproduct),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          // Check if the response is an array
          if (Array.isArray(data)) {
              // Update the table with fetched data
              const tableBody = document.getElementById('productTable');
              if (!tableBody) {
                  console.error('Table body not found.');
                  return;
              }

              tableBody.innerHTML = ''; // Clear existing rows

              data.forEach(product => {
                  const row = tableBody.insertRow();
                  console.log(product.id);
                  row.innerHTML = `
                      <td data-id="${product.id}">${product.id}</td>
                      <td>${product.productName}</td>
                      <td>${product.prdouchNameAr}</td>
                      <td>${product.country}</td>
                      <td>
                          <button type="button" id="editButton_${product.id}" class="btn btn-outline-primary" data-product-id="${product.id}">
                          
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                      </button>
                          </button>
                          <button type="button" id="deleteButton_${product.id}" class="btn btn-outline-danger" data-product-id="${product.id}">
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
          } else {
              console.error('Invalid response format:', data);
          }
      })
      .catch(error => console.error('Error fetching data:', error));

      
}