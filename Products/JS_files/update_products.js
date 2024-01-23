var urlParams = new URLSearchParams(window.location.search);
 populateForm(urlParams.get('id'))


function populateForm(id) {
    console.log('Edit Row function called with ID:', id);
    fetch(`https://arabbank.azurewebsites.net/api/product/getproductById?productid=${id}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(product => {
        // Store the current product data
        const productIdElement = document.getElementById('productId');
  
        const currentproductData = product[0];
        console.log(currentproductData);
        console.log('product ID Element:', productIdElement);
        console.log('productNameElement:', document.getElementById('productName'));
  
        // Populate the form with the existing product data
  
        console.log(productIdElement);
  
        
          // Set values for each form field
          
          productIdElement.value = currentproductData.id;
          document.getElementById('productName').value = currentproductData.productName;
          document.getElementById('productNameAR').value = currentproductData.prdouchNameAr;
          document.getElementById('country').value = currentproductData.country;
         
          
      })
      .catch(error => console.error('Error fetching product data:', error));
  }



  function closeForm() {
    window.location.href = 'products.html';
  }



  function updateproduct(id) {
    console.log('Updating product with ID:', id);

    // Fetch the updated data from the form
    const newData = {
        id: parseInt(document.getElementById('productId').value, 10),
        productName: document.getElementById('productName').value,
        prdouchNameAr: document.getElementById('productNameAR').value,
        country: document.getElementById('country').value
    }
       

    console.log('New Data:', newData);

    const url = `https://arabbank.azurewebsites.net/api/product/${id}`;

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
        console.log('product data updated successfully!');
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