function closeForm() {
    window.location.href = 'cities.html';
  }
  
  function submitForm() {
    const formData = {
      "id": 0,
      "cityName": document.getElementById('cityName').value,
      "cityNameAR": document.getElementById('cityNameAR').value,
      "country" :  document.getElementById('country').value,
    }
  
    fetch('https://arabbank.azurewebsites.net/api/city', {
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
      window.location.href = 'cities.html';
      closeForm()
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle the error, e.g., display an error message
      alert('An error occurred while adding the city.');
    });
  }