function closeForm() {
  window.location.href = 'branches.html';
}

function submitForm() {
  const formData = {
    "id": 0,
    "branchName": document.getElementById('branchName').value,
    "branchNameAR": document.getElementById('branchNameAR').value,
    "branchNumber": document.getElementById('branchNumber').value,
    "countryName": document.getElementById('countryName').value,
    "cityName": document.getElementById('cityName').value
  };

  fetch('https://arabbank.azurewebsites.net/api/branch', {
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
    alert('An error occurred while adding the branch.');
  });
}