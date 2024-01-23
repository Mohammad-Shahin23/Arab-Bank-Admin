var urlParams = new URLSearchParams(window.location.search);
populateForm(urlParams.get('id'));

function populateForm(id) {
    console.log('Edit Row function called with ID:', id);
    fetch(`https://arabbank.azurewebsites.net/api/subproduct/${id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(subProduct => {
        console.log('API Response:', subProduct);

        // Check specific properties
        console.log('ID:', subProduct.id);
        console.log('subProductName:', subProduct.subProductName);
        console.log('subProductNameAr:', subProduct.subProductNameAr);
        console.log('image:', subProduct.image);
        console.log('loanDetail:', subProduct.loanDetail);
        if (subProduct) {
            const currentSubProductData = subProduct;

            // Set values for each form field
            document.getElementById('subProductId').value = currentSubProductData.id;
            document.getElementById('subProductName').value = currentSubProductData.subProductName;
            document.getElementById('subProductNameAR').value = currentSubProductData.subProductNameAr;
            document.getElementById('country').value = currentSubProductData.country;
            document.getElementById('loanDetail').value = currentSubProductData.loanDetail;
            document.getElementById('product').value = currentSubProductData.product;
            
            // Display the image
            displayImage(currentSubProductData.image);

            // Additional operations can be performed here

            console.log('subProductNameElement:', document.getElementById('subProductName'));
        } else {
            console.error('Error: SubProduct data not found or invalid.');
        }
    })
    .catch(error => console.error('Error fetching subProduct data:', error));
}

function displayImage(base64Image) {
    const imageElement = document.getElementById('displayedImage');

    // Convert base64 to blob
    const blob = b64toBlob(base64Image, 'image/png');

    // Create an object URL for the blob
    const blobUrl = URL.createObjectURL(blob);

    // Set the blob URL as the image source after the image has loaded
    imageElement.onload = function () {
        URL.revokeObjectURL(blobUrl); // Clean up the object URL to prevent memory leaks
    };

    // Set the blob URL as the image source
    imageElement.src = blobUrl;
}

// Function to convert base64 to blob
function b64toBlob(base64, type = 'application/octet-stream') {
    // Remove data URL part if present
    const base64WithoutHeader = base64.replace(/^data:[^;]+;base64,/, '');

    const sliceSize = 512;
    const byteCharacters = atob(base64WithoutHeader);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type });
    return blob;
}



// Function to display the selected image
function updateImagePreview(base64Image) {
    const previewImageElement = document.getElementById('displayedImage');
    
    // Convert base64 to blob
    const blob = b64toBlob(base64Image, 'image/png');
    
    // Create an object URL for the blob
    const blobUrl = URL.createObjectURL(blob);
    
    // Set the blob URL as the image source after the image has loaded
    previewImageElement.onload = function () {
        URL.revokeObjectURL(blobUrl); // Clean up the object URL to prevent memory leaks
    };
    
    // Set the blob URL as the image source
    previewImageElement.src = blobUrl;
}

// Add an event listener for the image input change event
document.getElementById('image').addEventListener('change', function() {
    // Check if an image is selected
    if (this.files.length > 0) {
        const imageFile = this.files[0];

        // Read the image file as a data URL (base64)
        const reader = new FileReader();

        reader.onload = function () {
            const imageData = reader.result;

            // Call updateImagePreview to display the selected image
            updateImagePreview(imageData);
        };

        // Read the image file as a data URL
        reader.readAsDataURL(imageFile);
    }
});

function updatesubProduct() {
    const subProductId = document.getElementById('subProductId').value;
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

        reader.onload = function () {
            const imageData = reader.result;

            // Call updateImagePreview to display the selected image
            updateImagePreview(imageData);

            // Create formData with base64-encoded image data
            const formData = {
                "id": subProductId,
                "subProductName": subProductName,
                "subProductNameAr": subProductNameAR,
                "loanDetail": loanDetail,
                "country": country,
                "product": product,
                "image": imageData  // Base64-encoded image data
            };

            // Perform the fetch with the formData
            fetch(`https://arabbank.azurewebsites.net/api/subProduct/${subProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                console.log('Response from server:', response);
                if (response.ok) {
                    // The update was successful, you might not have data in the response
                    // Optionally, you can log a success message or handle it as needed
                    console.log('SubProduct updated successfully.');
                } else {
                    // The server returned an error status code
                    // Optionally, you can log an error message or handle it as needed
                    console.error('Error updating subProduct. Server returned:', response.status, response.statusText);
                }
            })
            .then(() => {
                // Optionally, you can navigate to the specified page after successful submission
                window.location.href = 'subProducts.html';
                closeForm();
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, e.g., display an error message
                alert('An error occurred while updating the subProduct.');
            });
        };

        // Read the image file as a data URL
        reader.readAsDataURL(imageFile);
    } else {
        // Create formData without image data
        alert("img was not selected");  
    }
}



function closeForm() {
    window.location.href = 'subProducts.html';
}