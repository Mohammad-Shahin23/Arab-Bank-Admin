// const selectImage = document.querySelector('.select-image');
//     const inputFile = document.querySelector('#file');
//     const imgArea = document.querySelector('.img-area');

//     selectImage.addEventListener('click', function () {
//         inputFile.click();
//     });

//     inputFile.addEventListener('change', function (event) {
//         event.preventDefault();

//         const image = this.files[0];
//         if (image.size < 2000000) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const allImg = imgArea.querySelectorAll('img');
//                 allImg.forEach(item => item.remove());
//                 const imgUrl = reader.result;
//                 const img = document.createElement('img');
//                 img.src = imgUrl;
//                 imgArea.appendChild(img);
//                 imgArea.classList.add('active');
//                 imgArea.dataset.img = image.name;
//             };
//             reader.readAsDataURL(image);
//         } else {
//             alert("Image size more than 2MB");
//         }
//         return false;
//     });

    // Add 'submit' event listener to the form
    // document.getElementById('subProductForm').addEventListener('submit', function (event) {
    //     submitForm(event); // Pass the event parameter to submitForm
    // });

//     function submitForm(event) {
//         event.preventDefault();

//         const subProductName = document.getElementById('subProductName').value;
//         const subProductNameAR = document.getElementById('subProductNameAR').value;
//         const country = document.getElementById('country').value;
//         const loanDetail = document.getElementById('loanDetail').value;
//         const product = document.getElementById('product').value;

//         const imageInput = document.getElementById('file');

//         if (imageInput.files.length > 0) {
//             const imageFile = imageInput.files[0];
//             const reader = new FileReader();

//             reader.onloadend = function () {
//                 const imageData = reader.result;

//                 const formData = {
//                     "id": 0,
//                     "subProductName": subProductName,
//                     "subProductNameAr": subProductNameAR,
//                     "loanDetail": loanDetail,
//                     "country": country,
//                     "product": product,
//                     "image": imageData
//                 };

//                 fetch('https://arabbank.azurewebsites.net/api/subProduct', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(formData),
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     window.location.href = 'subProducts.html';
//                     closeForm();
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                     alert('An error occurred while adding the subProduct.');
//                 });
//             };

//             reader.readAsDataURL(imageFile);
//         } else {
//             alert('Please select an image.');
//         }
//     }

//   


const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');

selectImage.addEventListener('click', function () {
    inputFile.click();
});

inputFile.addEventListener('change', function (event) {
    event.preventDefault();

    const image = this.files[0];

    if (image) {
        const reader = new FileReader();
        reader.onload = () => {
            const allImg = imgArea.querySelectorAll('img');
            allImg.forEach(item => item.remove());
            const imgUrl = reader.result;
            const img = document.createElement('img');
            img.src = imgUrl;
            imgArea.appendChild(img);
            imgArea.classList.add('active');
            imgArea.dataset.img = image.name;
        };
        reader.readAsDataURL(image);
    }

    return false;
});

fetch('https://arabbank.azurewebsites.net/api/COUNTRY')
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
                // Assuming you have a function named filterProducts to handle the product selection logic
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
        fetch('https://arabbank.azurewebsites.net/api/Product/GetProductByCountry', {
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
    
                    // If it's the first product, you can trigger additional actions if needed
                   
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    let isSubmitting = false;

function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Check if the form is already being submitted
    if (isSubmitting) {
        console.log('Form is already being submitted. Ignoring.');
        return;
    }

    // Set the flag to indicate that form submission is in progress
    isSubmitting = true;

    // Get the form data
    const subProductName = document.getElementById('subProductName').value;
    const subProductNameAR = document.getElementById('subProductNameAR').value;
    const loanDetail = document.getElementById('loanDetail').value;
    const country = document.getElementById('country').value;
    const product = document.getElementById('product').value;
    const fileInput = document.getElementById('file');

    // Check if a file is selected
    if (fileInput.files.length === 0) {
        console.error('No file selected');
        isSubmitting = false; // Reset the flag
        return;
    }

    const imageData = fileInput.files[0];

    // Check if the file is a valid Blob
    if (!(imageData instanceof Blob)) {
        console.error('Invalid file type');
        isSubmitting = false; // Reset the flag
        return;
    }

    // Convert image data to base64
    const reader = new FileReader();
    reader.onloadend = function() {
        const base64Image = reader.result.split(',')[1]; // Extract base64 string (remove data:image/png;base64,)

        // Add the data URI prefix if not present
        const imageDataUri = base64Image.startsWith('data:image/jpeg;base64,') ? base64Image : `data:image/jpeg;base64,${base64Image}`;

        // Create the formData object
        const formData = {
            "id": 0, // Replace with the appropriate value if needed
            "subProductName": subProductName,
            "subProductNameAr": subProductNameAR,
            "loanDetail": loanDetail,
            "country": country,
            "product": product,
            "image": imageDataUri
        };

        // Log the data being sent
        console.log('Sending data:', formData);

        // Make a POST request to the API
        fetch('https://arabbank.azurewebsites.net/api/subProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Handle the successful response
            console.log('Received data from the server:', data);

            // You can add additional logic here if needed
        })
        .catch(error => {
            // Handle errors
            console.error('Error submitting form:', error);
        })
        .finally(() => {
            // Reset the flag after form submission is complete
            isSubmitting = false;
            
            // Close the form after submission
            closeForm();
        });
    };

    // Read the image file as base64
    reader.readAsDataURL(imageData);
}

// Attach the submitForm function to the form's submit event
const subProductForm = document.getElementById('subProductForm');
subProductForm.addEventListener('submit', submitForm);


    function closeForm() {
          window.location.href = 'subProducts.html';
     }