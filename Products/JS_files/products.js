document.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loader');
  const tableBody = document.querySelector('#productTable');
  const countrySelect = document.getElementById('countrySlec');

  tableBody.addEventListener('click', function (event) {  
    const editButtonPrefix = 'editButton_';
    const deleteButtonPrefix = 'deleteButton_';

    const clickedButton = event.target.closest('button');

    if (clickedButton) {
      const clickedId = clickedButton.dataset.productId;

      if (clickedButton.id.startsWith(editButtonPrefix)) {
        redirec_toUpdate(clickedId);
      } else if (clickedButton.id.startsWith(deleteButtonPrefix)) {
        deleteRow(clickedId);
      } else {
        console.log("None were selected");
      }
    }
  });


  fetch('https://arabbanktest.azurewebsites.net/api/COUNTRY')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      document.getElementById("countrySlec").innerHTML = '';
      return response.json();
    })
    .then(countries => {
      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.countryName;
        option.textContent = country.countryName;
        countrySelect.appendChild(option);
      });

      countrySelect.value = countrySelect.options[0].value;
      fetchCities();
    })
    .catch(error => console.error('Error fetching countries:', error));

    

  fetchCities();

  function deleteRow(id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    
    if (!isConfirmed) {
      // If the user cancels the deletion, do nothing
      return;
    }
  
    loader.style.display = 'block'; // Show loader before making the request
  
    fetch(`https://arabbanktest.azurewebsites.net/api/product?id=${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      loader.style.display = 'none'; // Hide loader once the request is completed
      if (response.ok) {
        const row = document.querySelector(`#productTable td[data-id="${id}"]`);
        if (row) {
          row.parentElement.remove();
          console.log("Deleted successfully");
        } else {
          console.error('Row not found in the DOM');
        }
      } else {
        console.error('Error deleting data:', response.status);
      }
    })
    .catch(error => {
      loader.style.display = 'none'; // Hide loader in case of an error
      console.error('Error deleting data:', error);
    });
  }
  
  
  
});

function fetchCities() {
  const loader = document.getElementById('loader');
  const tableBody = document.getElementById('productTable');
  const selectedProduct = document.getElementById('countrySlec').value;

  if (!selectedProduct) {
    return;
  }

  // Clear existing rows
  tableBody.innerHTML = '';

  loader.style.display = 'block'; // Show loader before making the request
  fetch('https://arabbanktest.azurewebsites.net/api/Product/GetProductByCountry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedProduct),
  })
  .then(response => {
    loader.style.display = 'none'; // Hide loader once the request is completed
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    data.forEach(product => {
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td data-id="${product.id}">${product.id}</td>
        <td>${product.productName}</td>
        <td>${product.prdouchNameAr}</td>
        <td>${product.country}</td>
        <td>
          <button type="button" id="editButton_${product.id}" class="btn btn-outline-primary" data-product-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button type="button" id="deleteButton_${product.id}" class="btn btn-outline-danger" data-product-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </td>
      `;
    });
  })
  .catch(error => {
    loader.style.display = 'none'; // Hide loader in case of an error
    console.error('Error fetching data:', error);
  });
}

function redirec_toUpdate(id) {
  var newUrl = `./update_products.html?id=${id}`;
  window.location.href = newUrl;
}
