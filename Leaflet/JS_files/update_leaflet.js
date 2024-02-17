
var urlParams = new URLSearchParams(window.location.search);
populateForm(urlParams.get('id'));

function populateForm(id) {
    console.log('Populating form with ID:', id);

    if (!id) {
        console.error('Error: ID is null or undefined.');
        return;
    }

    fetch(`https://arabbanktest.azurewebsites.net/api/leaflet/${id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(leafletData => {
        console.log('API Response:', leafletData);

        if (leafletData) {
            setFormField('leafletId', leafletData.id);
            setFormField('country', leafletData.country);
            setFormField('leafletProductName', leafletData.product);
            setFormField('leafletSubProductName', leafletData.subProduct);
            setFormField('leafletSubProductAr', leafletData.subProductAr);

            // Display images in designated areas
            displayImageInArea(leafletData.leafletPage1, 1);
            displayImageInArea(leafletData.leafletPage2, 2);
            displayImageInArea(leafletData.leafletPage3, 3);
            displayImageInArea(leafletData.leafletPage4, 4);
            displayImageInArea(leafletData.leafletPage1AR, 5);
            displayImageInArea(leafletData.leafletPage2AR, 6);
            displayImageInArea(leafletData.leafletPage3AR, 7);
            displayImageInArea(leafletData.leafletPage4AR, 8);
        } else {
            console.error('Error: Leaflet data not found or invalid.');
        }
    })
    .catch(error => console.error('Error fetching leaflet data:', error));
}

function setFormField(fieldId, value) {
    const element = document.getElementById(fieldId);
    if (element) {
        element.value = value;
    } else {
        console.error(`Error: Element with ID '${fieldId}' not found.`);
    }
}

function displayImageInArea(base64String, areaIndex) {
    console.log(`Displaying image in area ${areaIndex}:`, base64String);

    const imgArea = document.querySelector(`.img-area${areaIndex}`);
    imgArea.innerHTML = ''; // Clear existing content

    const img = document.createElement('img');
    img.src = base64String;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    imgArea.appendChild(img);
    imgArea.classList.add('active');
    imgArea.dataset.img = base64String;
}

const selectImages = document.querySelectorAll('.select-image');
const imgAreas = document.querySelectorAll('.img-area1, .img-area2, .img-area3, .img-area4, .img-area5, .img-area6, .img-area7, .img-area8');
const inputFiles = document.querySelectorAll('.file-input');

function handleFileInputChange(index) {
    return function () {
      const image = this.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        const allImg = imgAreas[index].querySelectorAll('img');
        allImg.forEach(item => item.remove());
  
        const imgUrl = reader.result;
        const img = document.createElement('img');
        img.src = imgUrl;
  
        imgAreas[index].appendChild(img);
        imgAreas[index].classList.add('active');
        imgAreas[index].dataset.img = image.name;
      };
  
      reader.readAsDataURL(image);
    };
  }
  


    for (let index = 0; index < selectImages.length; index++) {
        // Add click event listener to each 'select-image' element
        selectImages[index].addEventListener('click', function (event) {
            console.log('Select Image clicked'); // Log for debugging
            // Prevent the default form submission behavior
            event.preventDefault();
    
            // Trigger the corresponding 'file-input' element to open the file dialog
            inputFiles[index].click();
        });
    
        // Add change event listener to each 'file-input' element
        inputFiles[index].addEventListener('change', handleFileInputChange(index));
    }


    function updateleaflet(id) {
        if (!id) {
            console.error('Error: ID is null or undefined.');
            return;
        }
    
        const url = `https://arabbanktest.azurewebsites.net/api/leaflet/${id}`;
    
        const formData = {
            id: parseInt(id),
            country: document.getElementById('country').value,
            product: document.getElementById('leafletProductName').value,
            subProduct: document.getElementById('leafletSubProductName').value,
            subProductAr: document.getElementById('leafletSubProductAr').value,
        };
    
        // Add file properties to requestBody
        inputFiles.forEach((fileInput, index) => {
            const fileName = fileInput.name;  // Move this line inside the loop
        
            const isVisible = !fileInput.closest('.container').hasAttribute('hidden');
        
            if (isVisible) {
                const imageArea = imgAreas[index];
                const imgElement = imageArea.querySelector('img');
        
                if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
                    // Check if the image is fully loaded and has a natural width
                    formData[fileName] = imgElement.src;  // Use the original image source
                } else {
                    formData[fileName] = null;
                }
            } else {
                formData[fileName] = null;
            }
        });
        
        console.log('PUT request payload:', formData);
        
    
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(() => {
            console.log('Success:');
            // Redirect to a new page after successful submission
            window.location.href = './leaflet.html';
          })
        
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to update leaflet. ${error.message}`);
        });
    }
    

    
    


   
    
    

function closeForm() {
    window.location.href = './leaflet.html';
}

// fetch('https://arabbanktest.azurewebsites.net/api/COUNTRY')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(countries => {
//         const countrySelect = document.getElementById('country');

//         countries.forEach((country, index) => {
//             const option = document.createElement('option');
//             option.value = country.countryName;
//             option.textContent = country.countryName;
//             countrySelect.appendChild(option);
//             if (index === 0) {
//                 // Assuming you have a function named filterProducts to handle the product selection logic
//                 fetchProducts();
//             }
            
//         });
//     })
//     .catch(error => console.error('Error fetching countries:', error));





//     const countryDropdown = document.getElementById('country');

//     // Add an event listener for the "change" event
//     countryDropdown.addEventListener('change', function () {
//         fetchProducts();
//     });



    // function fetchProducts() {
    //     // Get the selected country
    //     const selectedCountry = document.getElementById('country').value;
    
    //     // Make a POST request to the API
    //     fetch('https://arabbanktest.azurewebsites.net/api/Product/GetProductByCountry', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(selectedCountry)
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log('Received data from the server:', data);

    
    //             // Update the product dropdown with the new data
    //             const productDropdown = document.getElementById('product');
    //             productDropdown.innerHTML = ''; // Clear existing options
    
    //             data.forEach((product) => {
    //                 console.log('Adding product:', product.productName);
    //                 const option = document.createElement('option');
    //                 option.value = product.productName;
    //                 option.textContent = product.productName;
    //                 productDropdown.appendChild(option);
    
    //                 // If it's the first product, you can trigger additional actions if needed
                   
    //             });
    //         })
    //         .catch(error => console.error('Error fetching products:', error));
    // }











