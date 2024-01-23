


function closeForm() {
    window.location.href = 'subProducts.html';
  }
  
  function submitForm() {
    const subProductName = document.getElementById('subProductName').value;
    const subProductNameAR = document.getElementById('subProductNameAR').value;
    const country = document.getElementById('country').value;
    const loanDetail = document.getElementById('loanDetail').value;
    const product = document.getElementById('product').value;

    // Get the image file input element
    const imageInput = document.getElementById('image');
    
    // Check if an image is selected
    if (imageInput.files.length > 0) {
        const imageFile = imageInput.files[0];

        // Read the image file as a data URL (base64)
        const reader = new FileReader();

        reader.onloadend = function () {
            const imageData = reader.result;

            // Create formData with base64-encoded image data
            const formData = {
                "id": 0,
                "subProductName": subProductName,
                "subProductNameAr": subProductNameAR,
                "loanDetail": loanDetail,
                "country": country,
                "product": product,
                "image": imageData  // Base64-encoded image data
            };

            // Perform the fetch with the formData
            fetch('https://arabbank.azurewebsites.net/api/subProduct', {
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
                window.location.href = 'subProducts.html';
                closeForm();
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, e.g., display an error message
                alert('An error occurred while adding the subProduct.');
            });
        };

        // Read the image file as a data URL
        reader.readAsDataURL(imageFile);
    } else {
        // Handle the case where no image is selected
        alert('Please select an image.');
    }
}




