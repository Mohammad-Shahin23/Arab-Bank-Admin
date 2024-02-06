function base64ToImage(base64) {
        const img = document.createElement('img');
        img.src = base64;
        img.width = 75; // You can set the desired width
        img.height = 65; // You can set the desired height
        return img;
    }



    


    // // Call the fetchData function when the page loads
    window.onload = fetchData;

    function addEventListeners() {
        const tableBody = document.querySelector('#subProductTable');
    
        tableBody.addEventListener('click', function (event) {
            console.log('Click event detected');
    
            const editButtonPrefix = 'editButton_';
            const deleteButtonPrefix = 'deleteButton_';
    
            const clickedButton = event.target.closest('button');
    
            if (clickedButton) {
                const  clickedId = clickedButton.dataset.subproductId;
                
                console.log('Clicked ID:', clickedId);
                console.log('Clicked button:', clickedButton);
    
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
    

    function fetchData() {
        fetch('https://arabbank.azurewebsites.net/api/COUNTRY')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((countries, index) => {
                // Update the options in the select element
                const countrySelect = document.getElementById('countrySlec');
                countrySelect.innerHTML = ''; // Clear existing options
    
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.countryName;
                    option.textContent = country.countryName;
                    countrySelect.appendChild(option);
                });
                fetchProducts();
            })
            .catch(error => console.error('Error fetching countries:', error));
    }
    
    
    function redirectToUpdate(id) {
        console.log('Redirecting to update with ID:', id);
        // Construct the new URL with the parameter
        var newUrl = `update_subProducts.html?id=${id}`;
    
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
    
    function fetchProducts() {
        // Get the selected country
        const selectedCountry = document.getElementById('countrySlec').value;
    
        // Make a POST request to the API
         fetch('https://arabbank.azurewebsites.net/api/Product/GetProductByCountry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedCountry )
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received data from the server:', data);

                // Update the product dropdown with the new data
                const productDropdown = document.getElementById('productSlec');
    
                productDropdown.innerHTML = ''; // Clear existing options
    
                data.forEach((product, index) => {
                    console.log('Adding product:', product.productName);
                    const option = document.createElement('option');
                    option.value = product.productName;
                    option.textContent = product.productName;
                    productDropdown.appendChild(option);
    
                    // If it's the first city, trigger fetchBranches
                    if (index === 0) {
                        filterProducts();
                    }
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
                    if (response.status === 404) {
                        console.warn('No sub-products found for the selected country and product.');
                        const subProductTableBody = document.getElementById('subProductTable');
                        subProductTableBody.innerHTML = '<h2>No sub-products available<h2>';
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
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
                            <td>${subProduct.subProductName}</td>
                            <td>${subProduct.subProductNameAr}</td>
                            <td>${subProduct.product}</td>
                            <td></td>
                            <td>${subProduct.loanDetail}</td>
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
                        const imgCell = row.querySelector('td:nth-child(5)');
                        imgCell.appendChild(await base64ToImage(`${subProduct.image}`));
                        console.log(`Created delete button with ID: deleteButton_${subProduct.id}`);
                    });
                    // Add event listeners after updating the table
                    addEventListeners();
                } else {
                    console.warn('No sub-products found for the selected country and product.');
                    subProductTableBody.innerHTML = '<h2>No sub-products available<h2>';
                }
            })
            .catch(error => {
                console.error('Error fetching sub-products:', error);
            });
    }
    
    // Add initial event listeners
    addEventListeners();
    