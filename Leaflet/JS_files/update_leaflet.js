// document.addEventListener('DOMContentLoaded', function () {
//     // Your code here
//     var urlParams = new URLSearchParams(window.location.search);
//     populateForm(urlParams.get('id'));

//     // Add event listeners for each image input element
//     addImageInputEventListener('leafletPage1', 'leafletPage1Preview');
//     addImageInputEventListener('leafletPage2', 'leafletPage2Preview');
//     addImageInputEventListener('leafletPage3', 'leafletPage3Preview');
//     addImageInputEventListener('leafletPage4', 'leafletPage4Preview');
//     addImageInputEventListener('leafletPage5', 'leafletPage5Preview');
//     addImageInputEventListener('leafletPage6', 'leafletPage6Preview');

//     addImageInputEventListener('leafletPage1AR', 'leafletPage1ARPreview');
//     addImageInputEventListener('leafletPage2AR', 'leafletPage2ARPreview');
//     addImageInputEventListener('leafletPage3AR', 'leafletPage3ARPreview');
//     addImageInputEventListener('leafletPage4AR', 'leafletPage4ARPreview');
//     addImageInputEventListener('leafletPage5AR', 'leafletPage5ARPreview');
//     addImageInputEventListener('leafletPage6AR', 'leafletPage6ARPreview');
// });

// function populateForm(id) {
//     console.log('Edit Row function called with ID:', id);
//     fetch(`https://arabbank.azurewebsites.net/api/leaflet/${id}`, {
//         method: 'GET'
//     })
//     .then(response => response.json())
//     .then(leaflet => {
//         console.log('API Response:', leaflet);

//         if (leaflet) {
//             const currentLeafletData = leaflet;
//             console.log('Setting value for leafletProductName:', currentLeafletData.product);
//             // Set values for each form field leafletPage5AR
//             document.getElementById('leafletId').value = currentLeafletData.id;

//             // Add these lines for debugging
//             console.log('Setting value for leafletProductName:', currentLeafletData.product);
//             console.log('Element with ID leafletProductName:', document.getElementById('leafletProductName'));

//             document.getElementById('leafletProductName').value = "currentLeafletData.product;"
//             document.getElementById('leafletSubProductName').value = currentLeafletData.subProduct;
//             document.getElementById('country').value = currentLeafletData.country;

//             // Set values for leaflet pages (you might need to adjust these based on your actual data)
//             document.getElementById('leafletPage1').value = currentLeafletData.leafletPage1;
//             document.getElementById('leafletPage2').value = currentLeafletData.leafletPage2;
//             document.getElementById('leafletPage3').value = currentLeafletData.leafletPage3;
//             document.getElementById('leafletPage4').value = currentLeafletData.leafletPage4;
//             document.getElementById('leafletPage5').value = currentLeafletData.leafletPage5;
//             document.getElementById('leafletPage6').value = currentLeafletData.leafletPage6;

//             // Repeat for other pages...

//             // Set values for leaflet pages (AR)
//             document.getElementById('leafletPage1AR').value = currentLeafletData.leafletPage1AR;
//             document.getElementById('leafletPage2AR').value = currentLeafletData.leafletPage2AR;
//             document.getElementById('leafletPage3AR').value = currentLeafletData.leafletPage3AR;
//             document.getElementById('leafletPage4AR').value = currentLeafletData.leafletPage4AR;
//             document.getElementById('leafletPage5AR').value = currentLeafletData.leafletPage5AR;
//             document.getElementById('leafletPage6AR').value = currentLeafletData.leafletPage6AR;

//             // Additional operations can be performed here

//             console.log('leafletProductName:', document.getElementById('leafletProductName').value);
//         } else {
//             console.error('Error: Leaflet data not found or invalid.');
//         }
//     })
//     .catch(error => console.error('Error fetching Leaflet data:', error));
// }

// function addImageInputEventListener(inputId, imageElementId) {
//     // Add an event listener for the image input change event
//     document.getElementById(inputId).addEventListener('change', function () {
//         // Check if an image is selected
//         if (this.files.length > 0) {
//             const imageFile = this.files[0];

//             // Read the image file as a data URL (base64)
//             const reader = new FileReader();

//             reader.onload = function () {
//                 const imageData = reader.result;

//                 // Call updateImagePreview to display the selected image
//                 updateImagePreview(imageData, imageElementId);
//             };

//             // Read the image file as a data URL
//             reader.readAsDataURL(imageFile);
//         }
//     });
// }

// function updateImagePreview(base64Image, imageElementId) {
//     const imageElement = document.getElementById(imageElementId);

//     // Convert base64 to blob
//     const blob = b64toBlob(base64Image, 'image/png');

//     // Create an object URL for the blob
//     const blobUrl = URL.createObjectURL(blob);

//     // Set the blob URL as the image source after the image has loaded
//     imageElement.onload = function () {
//         URL.revokeObjectURL(blobUrl); // Clean up the object URL to prevent memory leaks
//     };

//     // Set the blob URL as the image source
//     imageElement.src = blobUrl;
// }

// function displayImage(base64Image) {
//     const imageElement = document.getElementById('displayedImage');

//     // Convert base64 to blob
//     const blob = b64toBlob(base64Image, 'image/png');

//     // Create an object URL for the blob
//     const blobUrl = URL.createObjectURL(blob);

//     // Set the blob URL as the image source after the image has loaded
//     imageElement.onload = function () {
//         URL.revokeObjectURL(blobUrl); // Clean up the object URL to prevent memory leaks
//     };

//     // Set the blob URL as the image source
//     imageElement.src = blobUrl;
// }

// // Function to convert base64 to blob
// function b64toBlob(base64, type = 'application/octet-stream') {
//     // Remove data URL part if present
//     const base64WithoutHeader = base64.replace(/^data:[^;]+;base64,/, '');

//     const sliceSize = 512;
//     const byteCharacters = atob(base64WithoutHeader);
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//         const slice = byteCharacters.slice(offset, offset + sliceSize);

//         const byteNumbers = new Array(slice.length);
//         for (let i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//         }

//         const byteArray = new Uint8Array(byteNumbers);
//         byteArrays.push(byteArray);
//     }

//     const blob = new Blob(byteArrays, { type });
//     return blob;
// }

// function handleImageChange(elementId) {
//     const imageInput = document.getElementById(elementId);

//     if (imageInput.files.length > 0) {
//         const imageFile = imageInput.files[0];

//         const reader = new FileReader();

//         reader.onload = function () {
//             const imageData = reader.result;

//             // Call your image preview function or any other logic here
//             updateImagePreview(imageData);
//         };

//         reader.readAsDataURL(imageFile);
//     }
// }

// // Function to display the selected image
// // function updateImagePreview(base64Image) {
// //     const previewImageElement = document.getElementById('displayedImage');
    
// //     // Convert base64 to blob
// //     const blob = b64toBlob(base64Image, 'image/png');
    
// //     // Create an object URL for the blob
// //     const blobUrl = URL.createObjectURL(blob);
    
// //     // Set the blob URL as the image source after the image has loaded
// //     previewImageElement.onload = function () {
// //         URL.revokeObjectURL(blobUrl); // Clean up the object URL to prevent memory leaks
// //     };
    
// //     // Set the blob URL as the image source
// //     previewImageElement.src = blobUrl;
// // }

// // // Add an event listener for the image input change event
// // document.getElementById('image').addEventListener('change', function() {
// //     // Check if an image is selected
// //     if (this.files.length > 0) {
// //         const imageFile = this.files[0];

// //         // Read the image file as a data URL (base64)
// //         const reader = new FileReader();

// //         reader.onload = function () {
// //             const imageData = reader.result;

// //             // Call updateImagePreview to display the selected image
// //             updateImagePreview(imageData);
// //         };

// //         // Read the image file as a data URL
// //         reader.readAsDataURL(imageFile);
// //     }
// // });

// // function updateleaflet() {
// //     const leafletId = document.getElementById('leafletId').value;
// //     const leafletName = document.getElementById('leafletName').value;
// //     const leafletNameAR = document.getElementById('leafletNameAR').value;
// //     const country = document.getElementById('country').value;
// //     const loanDetail = document.getElementById('loanDetail').value;
// //     const product = document.getElementById('product').value;

// //     // Get the image file input element
// //     const imageInput = document.getElementById('image');

// //     // Check if an image is selected
// //     if (imageInput.files.length > 0) {
// //         const imageFile = imageInput.files[0];

// //         // Read the image file as a data URL (base64)
// //         const reader = new FileReader();

// //         reader.onload = function () {
// //             const imageData = reader.result;

// //             // Call updateImagePreview to display the selected image
// //             updateImagePreview(imageData);

// //             // Create formData with base64-encoded image data
// //             const formData = {
// //                 "id": leafletId,
// //                 "leafletName": leafletName,
// //                 "leafletNameAr": leafletNameAR,
// //                 "loanDetail": loanDetail,
// //                 "country": country,
// //                 "product": product,
// //                 "image": imageData  // Base64-encoded image data
// //             };

// //             // Perform the fetch with the formData
// //             fetch(`https://arabbank.azurewebsites.net/api/leaflet/${leafletId}`, {
// //                 method: 'PUT',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify(formData),
// //             })
// //             .then(response => {
// //                 console.log('Response from server:', response);
// //                 if (response.ok) {
// //                     // The update was successful, you might not have data in the response
// //                     // Optionally, you can log a success message or handle it as needed
// //                     console.log('leaflet updated successfully.');
// //                 } else {
// //                     // The server returned an error status code
// //                     // Optionally, you can log an error message or handle it as needed
// //                     console.error('Error updating leaflet. Server returned:', response.status, response.statusText);
// //                 }
// //             })
// //             .then(() => {
// //                 // Optionally, you can navigate to the specified page after successful submission
// //                 window.location.href = 'leaflet.html';
// //                 closeForm();
// //             })
// //             .catch(error => {
// //                 console.error('Error:', error);
// //                 // Handle the error, e.g., display an error message
// //                 alert('An error occurred while updating the leaflet.');
// //             });
// //         };

// //         // Read the image file as a data URL
// //         reader.readAsDataURL(imageFile);
// //     } else {
// //         // Create formData without image data
// //         alert("img was not selected");  
// //     }
// // }



function closeForm() {
    window.location.href = 'leaflet.html';
}





// Function to populate the form with data from the API based on ID
async function populateForm(leafletId) {
try {
    // Make a request to the API to get data based on the ID
    const response = await fetch(`https://arabbank.azurewebsites.net/api/leaflet/${leafletId}`);
    const data = await response.json();

    // Debugging: Log the data to the console
    console.log("API Response:", data);

    // Check if the data object is not empty
    if (Object.keys(data).length > 0) {
        // Set values for text inputs
        document.getElementById("leafletId").value = data.id || '';
        document.getElementById("leafletProductName").value = data.product || '';
        document.getElementById("leafletSubProductName").value = data.subProduct || '';
        document.getElementById("country").value = data.country || '';

        // Display the image for leaflet page 1
       

        // Display the images for leaflet pages 2 to 6
        for (let i = 1; i <= 6; i++) {
            const base64ImagePage = data[`leafletPage${i}`];
            const previewElementPage = document.getElementById(`leafletPage${i}Preview`);
            if (previewElementPage) {
                displayImage(base64ImagePage, previewElementPage);
            } else {
                console.error(`Preview element for leafletPage${i} not found.`);
            }
        }

        // Display the image for leaflet page 1AR
      

        // Display the images for leaflet pages AR 2 to 6
        for (let i = 1; i <= 6; i++) {
            const base64ImagePageAR = data[`leafletPage${i}AR`];
            const previewElementPageAR = document.getElementById(`leafletPage${i}ARPreview`);
            if (previewElementPageAR) {
                displayImage(base64ImagePageAR, previewElementPageAR);
            } else {
                console.error(`Preview element for leafletPage${i}AR not found.`);
            }
        }
    } else {
        console.error("Empty object returned by the API.");
    }
} catch (error) {
    console.error("Error fetching data:", error);
}
}


// Function to set image preview from base64 data URL
function displayImage(base64Image, previewElement) {
// Set the base64 image as the source of the preview element
previewElement.src = base64Image;

// Make the preview element visible
previewElement.style.display = 'block'; // or 'inline-block'
}

// Define the base64ToImage function


function previewImage(input) {
    const previewId = input.id + "Preview";
    const preview = document.getElementById(previewId);

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const base64Image = e.target.result.split(',')[1];
            preview.src = "data:image/png;base64," + base64Image;
            preview.style.display = "block";

            // Set data-base64 attribute
            input.setAttribute('data-base64', base64Image);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
// Get the leafletId from the URL parameters and call populateForm
var urlParams = new URLSearchParams(window.location.search);
var leafletId = urlParams.get('id');
populateForm(leafletId);
