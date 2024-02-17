const selectImages = document.querySelectorAll('.select-image');
// Get all elements with class 'img-area'
const imgAreas = document.querySelectorAll('.img-area');
// Get all elements with class 'file-input'
const inputFiles = document.querySelectorAll('.file-input');

// Function to handle file input change
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

// Check if the elements are found before adding event listeners
if (selectImages.length === imgAreas.length && imgAreas.length === inputFiles.length) {
  // Loop through each 'select-image' element
  selectImages.forEach((selectImage, index) => {
    // Add click event listener to each 'select-image' element
    selectImage.addEventListener('click', function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();
      // Trigger the corresponding 'file-input' element to open the file dialog
      inputFiles[index].click();
    });

    // Add change event listener to each 'file-input' element
    inputFiles[index].addEventListener('change', handleFileInputChange(index));
  });
} else {
  console.error("Number of elements doesn't match. Please check your HTML structure.");
}

function submitForm() {
  const formData = {
      "country": document.getElementById('country').value,
      "product": document.getElementById('leafletProductName').value,
      "subProduct": document.getElementById('leafletSubProductName').value,
      "subProductAr": document.getElementById('leafletSubProductAr').value,
  };

  // Loop through each 'file-input' element
  inputFiles.forEach((fileInput, index) => {
      const fileName = fileInput.name;
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

  // Make a POST request
  fetch('https://arabbanktest.azurewebsites.net/api/leaflet', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
  })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          // Redirect to a new page after successful submission
          window.location.href = './leaflet.html';
      })
      .catch((error) => {
          console.error('Error:', error);
          // Handle errors as needed
      });
}


function closeForm() {
  window.location.href = './leaflet.html';
}



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
    
                    // If it's the first product, you can trigger additional actions if needed
                   
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    }








































// function previewImage(input) {
//   const previewId = input.id + "Preview";
//   const preview = document.getElementById(previewId);

//   if (input.files && input.files[0]) {
//     const reader = new FileReader();

//     reader.onload = function (e) {
//       preview.src = "data:image/png;base64," + e.target.result.split(',')[1];
//       preview.style.display = "block";

//       // Set data-base64 attribute
//       input.setAttribute('data-base64', e.target.result.split(',')[1]);
//     };

//     reader.readAsDataURL(input.files[0]);
//   }
// }

//     function submitForm() {
//     // Prepare data for submission

//     const leafletPage1Base64 = "data:image/png;base64," + document.getElementById('leafletPage1').getAttribute('data-base64');
//   const leafletPage2Base64 = "data:image/png;base64," + document.getElementById('leafletPage2').getAttribute('data-base64');
//   const leafletPage3Base64 = "data:image/png;base64," + document.getElementById('leafletPage3').getAttribute('data-base64');
// const leafletPage4Base64 = "data:image/png;base64," + document.getElementById('leafletPage4').getAttribute('data-base64');
// const leafletPage5Base64 = "data:image/png;base64," + document.getElementById('leafletPage5').getAttribute('data-base64');
// const leafletPage6Base64 = "data:image/png;base64," + document.getElementById('leafletPage6').getAttribute('data-base64');

// const leafletPage1ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage1AR').getAttribute('data-base64');
// const leafletPage2ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage2AR').getAttribute('data-base64');
// const leafletPage3ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage3AR').getAttribute('data-base64');
// const leafletPage4ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage4AR').getAttribute('data-base64');
// const leafletPage5ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage5AR').getAttribute('data-base64');
// const leafletPage6ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage6AR').getAttribute('data-base64');


// const formData = {
//   "id": 0,
//   "leafletPage1": leafletPage1Base64,
//   "leafletPage2": leafletPage2Base64,
//   "leafletPage3": leafletPage3Base64,
//   "leafletPage4": leafletPage4Base64,
//   "leafletPage5": leafletPage5Base64,
//   "leafletPage6": leafletPage6Base64,
//   "leafletPage1AR": leafletPage1ARBase64,
//   "leafletPage2AR": leafletPage2ARBase64,
//   "leafletPage3AR": leafletPage3ARBase64,
//   "leafletPage4AR": leafletPage4ARBase64,
//   "leafletPage5AR": leafletPage5ARBase64,
//   "leafletPage6AR": leafletPage6ARBase64,
//   "country": document.getElementById('country').value,
//   "product": document.getElementById('leafletProductName').value, // You can set the values accordingly
//   "subProduct":document.getElementById('leafletSubProductName').value, // You can set the values accordingly
// };

//     fetch('https://arabbank.azurewebsites.net/api/leaflet', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(formData)
//   })
//   .then(response => response.json())
//   .then(data => {
//     // Handle the response data as needed
//     console.log(data);
//     window.location.href = 'leaflet.html';
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// }













































// const selectImage = document.querySelector('.select-image');
// const inputFile = document.querySelector('#leafletPage1');
// const imgArea = document.querySelector('.img-area');

// selectImage.addEventListener('click', function () {
// 	inputFile.click();
// })

// inputFile.addEventListener('change', function () {
// 	const image = this.files[0]
// 	if(image.size < 2000000) {
// 		const reader = new FileReader();
// 		reader.onload = ()=> {
// 			const allImg = imgArea.querySelectorAll('img');
// 			allImg.forEach(item=> item.remove());
// 			const imgUrl = reader.result;
// 			const img = document.createElement('img');
// 			img.src = imgUrl;
// 			imgArea.appendChild(img);
// 			imgArea.classList.add('active');
// 			imgArea.dataset.img = image.name;
// 		}
// 		reader.readAsDataURL(image);
// 	} else {
// 		alert("Image size more than 2MB");
// 	}
// })


// function submitForm() {
//   const submitButton = document.querySelector('.btn-success'); // Add this line

//   // Get text input values before updating form data
//   const countryValue = document.getElementById('country').value;
//   const productNameValue = document.getElementById('leafletProductName').value;
//   const subProductNameValue = document.getElementById('leafletSubProductName').value;

//   // Create an object to hold the form data
//   const formData = {
//       id: 0,
//       leafletPage1: getBase64Data('leafletPage1'),
//       leafletPage2: getBase64Data('leafletPage2'),
//       leafletPage3: getBase64Data('leafletPage3'),
//       leafletPage4: getBase64Data('leafletPage4'),
//       leafletPage5: getBase64Data('leafletPage5'),
//       leafletPage6: getBase64Data('leafletPage6'),
//       leafletPage1AR: getBase64Data('leafletPageAR1'),
//       leafletPage2AR: getBase64Data('leafletPageAR2'),
//       leafletPage3AR: getBase64Data('leafletPageAR3'),
//       leafletPage4AR: getBase64Data('leafletPageAR4'),
//       leafletPage5AR: getBase64Data('leafletPageAR5'),
//       leafletPage6AR: getBase64Data('leafletPageAR6'),
//   };

//   // Update form data with text input values
//   formData.country = countryValue;
//   formData.product = productNameValue;
//   formData.subProduct = subProductNameValue;

//   // Disable the submit button to prevent multiple submissions
//   submitButton.disabled = true;

//   // Make POST request
//   fetch('https://arabbank.azurewebsites.net/api/leaflet', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//           // Add any additional headers if required by the API
//       },
//       body: JSON.stringify(formData),
//   })
//       .then(response => {
//           if (!response.ok) {
//               throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           return response.json();
//       })
//       .then(data => {
//           console.log('Success:', data);
//           // Handle success (redirect or show a success message)
//       })
//       .catch(error => {
//           console.error('Error:', error);
//           // Handle error (show an error message to the user)
//           alert('There was an error submitting the form. Please try again.');
//       })
//       .finally(() => {
//           // Re-enable the submit button
//           submitButton.disabled = false;
//           // Optionally, hide the loading spinner or message
//       });
// }








  // function previewImage(input, previewId) {
  //   const preview = document.getElementById(previewId);
  
  //   if (input.files && input.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       preview.src = "data:image/png;base64," + e.target.result.split(',')[1];
  //       preview.style.display = "block";
  
  //       // Set data-base64 attribute
  //       input.setAttribute('data-base64', e.target.result.split(',')[1]);
  //     };
  
  //     reader.readAsDataURL(input.files[0]);
  //   }
  // }
  
  //     function submitForm() {
  //     // Prepare data for submission
  
  //     const leafletPage1Base64 = "data:image/png;base64," + document.getElementById('leafletPage1').getAttribute('data-base64');
  //   const leafletPage2Base64 = "data:image/png;base64," + document.getElementById('leafletPage2').getAttribute('data-base64');
  //   const leafletPage3Base64 = "data:image/png;base64," + document.getElementById('leafletPage3').getAttribute('data-base64');
  // const leafletPage4Base64 = "data:image/png;base64," + document.getElementById('leafletPage4').getAttribute('data-base64');
  // const leafletPage5Base64 = "data:image/png;base64," + document.getElementById('leafletPage5').getAttribute('data-base64');
  // const leafletPage6Base64 = "data:image/png;base64," + document.getElementById('leafletPage6').getAttribute('data-base64');
  
  // const leafletPage1ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage1AR').getAttribute('data-base64');
  // const leafletPage2ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage2AR').getAttribute('data-base64');
  // const leafletPage3ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage3AR').getAttribute('data-base64');
  // const leafletPage4ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage4AR').getAttribute('data-base64');
  // const leafletPage5ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage5AR').getAttribute('data-base64');
  // const leafletPage6ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage6AR').getAttribute('data-base64');
  
  
  // const formData = {
  //   "id": 0,
  //   "leafletPage1": leafletPage1Base64,
  //   "leafletPage2": leafletPage2Base64,
  //   "leafletPage3": leafletPage3Base64,
  //   "leafletPage4": leafletPage4Base64,
  //   "leafletPage5": leafletPage5Base64,
  //   "leafletPage6": leafletPage6Base64,
  //   "leafletPage1AR": leafletPage1ARBase64,
  //   "leafletPage2AR": leafletPage2ARBase64,
  //   "leafletPage3AR": leafletPage3ARBase64,
  //   "leafletPage4AR": leafletPage4ARBase64,
  //   "leafletPage5AR": leafletPage5ARBase64,
  //   "leafletPage6AR": leafletPage6ARBase64,
  //   "country": document.getElementById('country').value,
  //   "product": document.getElementById('leafletProductName').value, // You can set the values accordingly
  //   "subProduct":document.getElementById('leafletSubProductName').value, // You can set the values accordingly
  // };
  
  //     fetch('https://arabbank.azurewebsites.net/api/leaflet', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(formData)
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Handle the response data as needed
  //     console.log(data);
  //     window.location.href = 'leaflet.html';
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // }