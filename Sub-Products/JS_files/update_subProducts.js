var urlParams = new URLSearchParams(window.location.search);
populateForm(urlParams.get('id'));

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

function setFormField(fieldId, value) {
    const element = document.getElementById(fieldId);
    if (element) {
        element.value = value;
    } else {
        console.error(`Error: Element with ID '${fieldId}' not found.`);
    }
}

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
        img.style.width = '100%';  // Ensure the image covers the entire area
        img.style.height = '100%';
        img.style.objectFit = 'cover';  // Maintain aspect ratio and cover the area

        // Append the new image
        imgArea.appendChild(img);
        imgArea.classList.add('active');
        imgArea.dataset.img = base64String;
    } else {
        console.error('Error: Image area element not found.');
    }
}

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



function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            let base64String = event.target.result;

            // Ensure that the base64 string is in PNG format
            base64String = base64String.replace(/^data:image\/(jpeg|jpg);base64,/, 'data:image/png;base64,');

            console.log('Converted to base64:', base64String); // Log the base64 string

            resolve(base64String);
        };

        reader.onerror = function (error) {
            console.error('Error converting file to base64:', error); // Log any errors
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}


const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');
const selectImage = document.querySelector('.select-image');

// Prevent default form submission when selecting an image
selectImage.addEventListener('click', function (event) {
    event.preventDefault();
    inputFile.click();
});

inputFile.addEventListener('change', handleFileChange);

document.getElementById('updateButton').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent default form submission
    await handleUpdate();
});

async function handleUpdate() {
    const subProductId = document.getElementById('id').value;
    const updatedFormData = await getUpdatedFormData(); // Use 'await' to wait for the result

    await updatesubProduct(subProductId, updatedFormData);
    closeForm(); // Add this line to close the form
}

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
                'Content-Type': 'application/json', // Set Content-Type header for JSON
            },
        });

        console.log('PUT Request Response:', response);

        if (!response.ok) {
            console.error('Failed to update SubProduct. Status:', response.status);
            const responseBody = await response.json();
            console.error('Response body:', responseBody);
            throw new Error("Update failed");
        }

        alert("Update successful");
    } catch (error) {
        console.error('Error in updatesubProduct:', error);
        alert("An unexpected error occurred during the update");
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
// Assuming you have a function to gather updated data from the form
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
    }

    return formData;
}

function closeForm() {
    window.location.href = 'subProducts.html';
}
