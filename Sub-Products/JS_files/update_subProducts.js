// Fetching URL parameters
var urlParams = new URLSearchParams(window.location.search);
populateForm(urlParams.get('id'));

// Populating form with data from API
function populateForm(id) {
    console.log('Edit Row function called with ID:', id);

    if (id === null || id === undefined) {
        console.error('Error: ID is null or undefined.');
        return;
    }

    fetch(`https://arabbank.azurewebsites.net/api/subproduct/${id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(subProduct => {
        console.log('API Response:', subProduct);

        if (subProduct) {
            const currentSubProductData = subProduct;
            setFormField('id', currentSubProductData.id);
            setFormField('subProductName', currentSubProductData.subProductName);
            setFormField('subProductNameAR', currentSubProductData.subProductNameAr);
            setFormField('country', currentSubProductData.country);
            setFormField('product', currentSubProductData.product);
            setFormField('loanDetail', currentSubProductData.loanDetail);

            displayImageInArea(currentSubProductData.image);
        } else {
            console.error('Error: SubProduct data not found or invalid.');
        }
    })
    .catch(error => console.error('Error fetching subProduct data:', error));
}

// Setting form field values
function setFormField(fieldId, value) {
    const element = document.getElementById(fieldId);
    if (element) {
        element.value = value;
    } else {
        console.error(`Error: Element with ID '${fieldId}' not found.`);
    }
}

// Displaying image in designated area
function displayImageInArea(base64String) {
    console.log('Displaying image:', base64String);

    const imgArea = document.querySelector('.img-area');
    if (imgArea) {
        // Remove existing images
        const allImg = Array.from(imgArea.querySelectorAll('img'));
        allImg.forEach(item => item.remove());

        // Create a new image element
        const img = document.createElement('img');
        img.src = base64String;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        // Append the new image
        imgArea.appendChild(img);
        imgArea.classList.add('active');
        imgArea.dataset.img = base64String;
    } else {
        console.error('Error: Image area element not found.');
    }
}

// Handling file change event
function handleFileChange(event) {
    console.log('File input changed.');

    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64String = event.target.result;
            console.log('Converted to base64:', base64String);
            displayImageInArea(base64String);
        };
        reader.onerror = function (error) {
            console.error('Error reading file:', error);
        };
        reader.readAsDataURL(file);
    }
}

// Getting updated form data
async function getUpdatedFormData() {
    const formData = {
        id: document.getElementById('id').value,
        subProductName: document.getElementById('subProductName').value,
        subProductNameAR: document.getElementById('subProductNameAR').value,
        loanDetail: document.getElementById('loanDetail').value,
        country: document.getElementById('country').value,
        product: document.getElementById('product').value,
        // Add any additional fields you need to update
    };

    const newImageFile = document.getElementById('file').files[0];

    if (newImageFile) {
        formData.image = await convertFileToBase64(newImageFile);
    } else {
        // No new image selected, use the existing image value
        const imgArea = document.querySelector('.img-area');
        formData.image = imgArea.dataset.img;
    }

    return formData;
}

// Closing the form and redirecting
function closeForm() {
    window.location.href = 'subProducts.html';
}

// Updating SubProduct
async function handleUpdate() {
    const subProductId = document.getElementById('id').value;
    const updatedFormData = await getUpdatedFormData();

    try {
        const response = await updatesubProduct(subProductId, updatedFormData);

        if (response.ok || response.status === 204) {
            // Successful update or 204 status (No Content), close the form or perform any other necessary actions
            closeForm();
        } else {
            // Unsuccessful update, show an alert with an appropriate message
            console.error('Failed to update SubProduct. Status:', response.status);
            const responseBody = await response.json();
            console.error('Response body:', responseBody);
            alert("Failed to update SubProduct. Please try again.");
        }
    } catch (error) {
        console.error('Error in handleUpdate:', error);
    }
}

// Updating SubProduct data via API
async function updatesubProduct(subProductId, updatedFormData) {
    try {
        const apiUrl = `https://arabbank.azurewebsites.net/api/subProduct/${subProductId}`;
        console.log('PUT Request URL:', apiUrl);

        const requestBody = {
            id: updatedFormData.id,
            subProductName: updatedFormData.subProductName,
            subProductNameAR: updatedFormData.subProductNameAR,
            loanDetail: updatedFormData.loanDetail,
            country: updatedFormData.country,
            product: updatedFormData.product,
        };

        if (updatedFormData.image) {
            requestBody.image = updatedFormData.image;
        }

        const response = await fetch(apiUrl, {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('PUT Request Response:', response);

        if (!response.ok && response.status !== 204) {
            console.error('Failed to update SubProduct. Status:', response.status);
            const responseBody = await response.text(); // Read response as text even if it's empty
            console.error('Response body:', responseBody);
            throw new Error("Update failed");
        }

        return response;
    } catch (error) {
        console.error('Error in updatesubProduct:', error);
        if (error.message !== "Update failed") {
            throw error;
        }
    }
}

// Helper function to convert base64 to Blob
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}

// Handling file input click event
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');
const selectImage = document.querySelector('.select-image');

// Prevent default form submission when selecting an image
selectImage.addEventListener('click', function (event) {
    event.preventDefault();
    inputFile.click();
});

// Handling file input change event
inputFile.addEventListener('change', handleFileChange);

// Flag to prevent multiple updates in progress
let isUpdateInProgress = false;

// Handling update button click event
document.getElementById('updateButton').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent default form submission

    if (!isUpdateInProgress) {
        isUpdateInProgress = true;

        try {
            await handleUpdate();
        } finally {
            isUpdateInProgress = false;
        }
    }
});
