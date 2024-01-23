function closeForm() {
  window.location.href = 'products.html';
}

function submitForm() {
  const formData = {
    "id": 0,
    "productName": document.getElementById('productName').value,
    "prdouchNameAr": document.getElementById('productNameAR').value,
    "country": document.getElementById('country').value,
 
  };

  fetch('https://arabbank.azurewebsites.net/api/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response from the API, e.g., display a success message
    
    // Optionally, you can navigate to the specified page after successful submission
    window.location.href = 'products.html';
    closeForm()
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error, e.g., display an error message
    alert('An error occurred while adding the product.');
  });
}