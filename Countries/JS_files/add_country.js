function closeForm() {
  window.location.href = 'countries.html';
}

function submitForm() {
  const formData = {
    "id": 0,
    "countryName": document.getElementById('countryName').value,
    "countryNameAR": document.getElementById('countryNameAR').value,
    "countryCode": document.getElementById('countryCode').value,
    "mobileCode": document.getElementById('mobileCode').value,
    "countryMobileHint": document.getElementById('countryMobileHint').value,
    "countryCurrencyCode": document.getElementById('countryCurrencyCode').value,
    "countryCurrencyCodeAr": document.getElementById('countryCurrencyCodeAr').value
  };

  fetch('https://arabbank.azurewebsites.net/api/CountrY', {
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
    window.location.href = 'countries.html';
    closeForm()
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error, e.g., display an error message
    alert('An error occurred while adding the country.');
  });
}