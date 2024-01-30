


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
