function base64ToImage(base64) {
        const img = document.createElement('img');
        img.src = base64;
        img.width = 50; // You can set the desired width
        img.height = 50; // You can set the desired height
        return img;
    }




document.addEventListener('DOMContentLoaded', function () {

    // Function to convert base64 to an image element
    

    



    // Function to handle the data in the subproduct
   async function fetchData() {
    try {
        // Fetch data from the API
        const response = await fetch('https://arabbank.azurewebsites.net/api/subproduct');
        const data = await response.json();

        // Get the selected country
        const selectedCountry = document.getElementById('countrySlec').value;

        // Get the table body element
        const tableBody = document.querySelector('#subProductTable');
        console.log(tableBody);

        // Clear existing rows
        tableBody.innerHTML = '';

        // Iterate through the data and create table rows based on the selected country
        data.forEach(subProduct => {
            if (!selectedCountry || subProduct.country === selectedCountry) {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td data-id="${subProduct.id}">${subProduct.id}</td>
                    <td>${subProduct.subProductName}</td>
                    <td>${subProduct.subProductNameAr}</td>
                    <td>${subProduct.product}</td>
                    <td>${subProduct.loanDetail}</td>
                    <td>${subProduct.country}</td>
                    <td></td> <!-- Placeholder for the image -->
                    <td>
                        <button type="button" id="editButton_${subProduct.id}" class="btn btn-outline-primary" data-subProduct-id="${subProduct.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button type="button" id="deleteButton_${subProduct.id}" class="btn btn-outline-danger" data-subProduct-id="${subProduct.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </td>
                `;

                // Set the image cell content
                const imgCell = row.querySelector('td:nth-child(7)');
                imgCell.appendChild(base64ToImage(`${subProduct.image}`));
            }
        });

        // Add event listeners after the table is populated
        addEventListeners();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


    // Call the fetchData function when the page loads
    window.onload = fetchData;

   

    function addEventListeners() {
        const tableBody = document.querySelector('#subProductTable');

        tableBody.addEventListener('click', function (event) {
            console.log('Click event detected');

            const editButtonPrefix = 'editButton_';
            const deleteButtonPrefix = 'deleteButton_';

            const clickedButton = event.target.closest('button');

            if (clickedButton) {
                const clickedId = clickedButton.dataset.subproductId;
                console.log('Clicked ID:', clickedId);

                if (clickedButton.id.startsWith(editButtonPrefix)) {
                    console.log('Edit button clicked');
                    redirectToUpdate(clickedId);
                } else if (clickedButton.id.startsWith(deleteButtonPrefix)) {
                    console.log('Delete button clicked');
                    deleteSubProduct(clickedId);
                } else {
                    console.log("None were selected");
                }
            }
        });
    }

    function redirectToUpdate(id) {
        // Construct the new URL with the parameter
        var newUrl = `./update_subproducts.html?id=${id}`;

        // Redirect to the new URL
        window.location.href = newUrl;
    }

    function deleteSubProduct(id) {
        // Make a DELETE request to the server to delete the corresponding data
        fetch(`https://arabbank.azurewebsites.net/api/subproduct/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    // If the server-side deletion is successful, remove the row from the DOM
                    const row = document.querySelector(`#subProductTable td[data-id="${id}"]`);
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

function fetchProducts() {
    // Get the selected country
    const selectedCountry = document.getElementById('countrySlec').value;
  
    // Make a POST request to the API
    fetch('https://arabbank.azurewebsites.net/api/Product/GetProductByCountry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( selectedCountry )
    })
    .then(response => response.json())
    .then(data => {
      console.log('Received data from the server:', data);
  
      // Update the product dropdown with the new data
      const productDropdown = document.getElementById('productSlec');
      productDropdown.innerHTML = ''; // Clear existing options
  
      data.forEach(product => {
        console.log('Adding product:', product.productName);
        const option = document.createElement('option');
        option.value = product.productName;
        option.textContent = product.productName;
        productDropdown.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching products:', error));
}


async function filterProducts() {
    // Get the selected country and product
    const selectedCountry = document.getElementById('countrySlec').value;
    const selectedProduct = document.getElementById('productSlec').value;
  
    // Create the request body
    const requestBody = {
      country: selectedCountry,
      product: selectedProduct
    };
  
    // Make a POST request to the API
    fetch('https://arabbank.azurewebsites.net/api/subproduct/getSubproductByCountryAndProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Update the table with the new data
      const subProductTableBody = document.getElementById('subProductTable');
      subProductTableBody.innerHTML = ''; // Clear existing rows

      if (data && data.length > 0) {
        data.forEach(async subProduct => {
            const row = subProductTableBody.insertRow();
            row.innerHTML = `
            <td data-id="${subProduct.id}">${subProduct.id}</td>
            <td>${subProduct.product}</td>
            <td>${subProduct.subProductName}</td>
            <td>${subProduct.subProductNameAr}</td>
            <td>${subProduct.country}</td>
            <td>${subProduct.loanDetail}</td>
            <td></td> <!-- Placeholder for the image -->

                    <td>
                        <button type="button" id="editButton_${subProduct.id}" class="btn btn-outline-primary" data-subProduct-id="${subProduct.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button type="button" id="deleteButton_${subProduct.id}" class="btn btn-outline-danger" data-subProduct-id="${subProduct.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </td>
          `;
          const imgCell = row.querySelector('td:nth-child(7)');
                imgCell.appendChild(await base64ToImage(`${subProduct.image}`));
            });
        
      } else {
        console.warn('No sub-products found for the selected country and product.');
        subProductTableBody.innerHTML = '<h2>No sub-products available<h2>';
      }
    })
    .catch(error => {
      console.error('Error fetching sub-products:', error);
    });
  }