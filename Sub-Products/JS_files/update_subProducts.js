// Fetching URL parameters
    var urlParams = new URLSearchParams(window.location.search);


    fetch('https://arabbanktest.azurewebsites.net/api/COUNTRY')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(countries => {
        const countrySelect = document.getElementById('country');

        countries.forEach((country, index) => {
            const option = document.createElement('option');
            option.value = country.countryName;
            option.textContent = country.countryName;
            countrySelect.appendChild(option);
            if (index === 0) {
                // Assuming you have a function named fetchProducts to handle the product selection logic
                fetchProducts();
            }
        });
    })
    .catch(error => console.error('Error fetching countries:', error));

const countryDropdown = document.getElementById('country');

// Add an event listener for the "change" event
countryDropdown.addEventListener('change', function () {
    fetchProducts();
});

function fetchProducts() {
    // Get the selected country
    const selectedCountry = document.getElementById('country').value;

    // Make a POST request to the API
    fetch('https://arabbanktest.azurewebsites.net/api/Product/GetProductByCountry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedCountry)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received data from the server:', data);

            // Update the product dropdown with the new data
            const productDropdown = document.getElementById('product');
            productDropdown.innerHTML = ''; // Clear existing options

            data.forEach((product) => {
                console.log('Adding product:', product.productName);
                const option = document.createElement('option');
                option.value = product.productName;
                option.textContent = product.productName;
                productDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}



    populateForm(urlParams.get('id'));

    // Populating form with data from API
    function populateForm(id) {
        console.log('Edit Row function called with ID:', id);

        if (id === null || id === undefined) {
            console.error('Error: ID is null or undefined.');
            return;
        }

        fetch(`https://arabbanktest.azurewebsites.net/api/subproduct/${id}`, {
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
        imgArea.innerHTML = ''; // Clear existing content

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
    }




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

        const newImageFile = document.getElementById('file');

        if (newImageFile && newImageFile.files && newImageFile.files.length > 0) {
            formData.image = await handleFileChange(newImageFile.files[0]);
        } else {
            // No new image selected, use the existing image value
            const imgArea = document.querySelector('.img-area');
            formData.image = imgArea.dataset.img;
        }

        return formData;
    }

    function handleFileChange(file) {
        console.log('File input changed.');

        return new Promise((resolve, reject) => {
            if (file) {
                console.log('Selected file type:', file.type);

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const base64String = event.target.result; // Keep the full data URI
                        console.log('Base64 string:', base64String);
                        displayImageInArea(base64String); // Display the image immediately
                        resolve(base64String);
                    };
                    reader.onerror = function (error) {
                        console.error('Error reading file:', error);
                        reject(error);
                    };
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error('Invalid file type. Please select an image file.'));
                }
            } else {
                reject(new Error('No file selected'));
            }
        });
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
// Updating SubProduct data via API
// Updating SubProduct data via API
async function updatesubProduct(subProductId, updatedFormData) {
    try {
        const apiUrl = `https://arabbanktest.azurewebsites.net/api/subProduct/${subProductId}`;
        console.log('PUT Request URL:', apiUrl);

        const requestBody = {
            id: subProductId,
            subProductName: updatedFormData.subProductName,
            subProductNameAR: updatedFormData.subProductNameAR,
            loanDetail: updatedFormData.loanDetail,
            country: updatedFormData.country,
            product: updatedFormData.product,
            image: updatedFormData.image, // Directly include the base64 image string
        };
        console.log('PUT image:', requestBody.image);

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
            const responseBody = await response.text();
            console.error('Response body:', responseBody);
            throw new Error("Update failed");
        }
        alert("SubProduct updated successfully");

        return response;
    } catch (error) {
        console.error('Error in updatesubProduct:', error);
        if (error.message !== "Update failed") {
            throw error;
        }
    }
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
inputFile.addEventListener('change', function (event) {
    handleFileChange(event.target.files[0]);
});

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
