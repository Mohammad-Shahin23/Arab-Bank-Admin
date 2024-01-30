


function closeForm() {
    window.location.href = 'leaflet.html';
  }
  
  function previewImage(input) {
    const previewId = input.id + "Preview";
    const preview = document.getElementById(previewId);
  
    if (input.files && input.files[0]) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        preview.src = "data:image/png;base64," + e.target.result.split(',')[1];
        preview.style.display = "block";
  
        // Set data-base64 attribute
        input.setAttribute('data-base64', e.target.result.split(',')[1]);
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }
  
      function submitForm() {
      // Prepare data for submission
  
      const leafletPage1Base64 = "data:image/png;base64," + document.getElementById('leafletPage1').getAttribute('data-base64');
    const leafletPage2Base64 = "data:image/png;base64," + document.getElementById('leafletPage2').getAttribute('data-base64');
    const leafletPage3Base64 = "data:image/png;base64," + document.getElementById('leafletPage3').getAttribute('data-base64');
  const leafletPage4Base64 = "data:image/png;base64," + document.getElementById('leafletPage4').getAttribute('data-base64');
  const leafletPage5Base64 = "data:image/png;base64," + document.getElementById('leafletPage5').getAttribute('data-base64');
  const leafletPage6Base64 = "data:image/png;base64," + document.getElementById('leafletPage6').getAttribute('data-base64');
  
  const leafletPage1ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage1AR').getAttribute('data-base64');
  const leafletPage2ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage2AR').getAttribute('data-base64');
  const leafletPage3ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage3AR').getAttribute('data-base64');
  const leafletPage4ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage4AR').getAttribute('data-base64');
  const leafletPage5ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage5AR').getAttribute('data-base64');
  const leafletPage6ARBase64 = "data:image/png;base64," + document.getElementById('leafletPage6AR').getAttribute('data-base64');
  
  
  const formData = {
    "id": 0,
    "leafletPage1": leafletPage1Base64,
    "leafletPage2": leafletPage2Base64,
    "leafletPage3": leafletPage3Base64,
    "leafletPage4": leafletPage4Base64,
    "leafletPage5": leafletPage5Base64,
    "leafletPage6": leafletPage6Base64,
    "leafletPage1AR": leafletPage1ARBase64,
    "leafletPage2AR": leafletPage2ARBase64,
    "leafletPage3AR": leafletPage3ARBase64,
    "leafletPage4AR": leafletPage4ARBase64,
    "leafletPage5AR": leafletPage5ARBase64,
    "leafletPage6AR": leafletPage6ARBase64,
    "country": document.getElementById('country').value,
    "product": document.getElementById('leafletProductName').value, // You can set the values accordingly
    "subProduct":document.getElementById('leafletSubProductName').value, // You can set the values accordingly
  };
  
      fetch('https://arabbank.azurewebsites.net/api/leaflet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response data as needed
      console.log(data);
      window.location.href = 'leaflet.html';
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }