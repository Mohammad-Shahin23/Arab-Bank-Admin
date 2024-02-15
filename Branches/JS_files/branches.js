document.addEventListener('DOMContentLoaded', function () {
  let currentbranchData;

  // Add event listeners after the editRow function is defined
  // Add event listener to the table, using event delegation
  const tableBody = document.querySelector('#branchTable');

  tableBody.addEventListener('click', function (event) {
    const editButtonPrefix = 'editButton_';
    const deleteButtonPrefix = 'deleteButton_';

    const clickedButton = event.target.closest('button');

    if (clickedButton) {
      const clickedId = clickedButton.dataset.branchId;

      if (clickedButton.id.startsWith(editButtonPrefix)) {
        console.log('Edit button clicked');
        redirec_toUpdate(clickedId);
      } else if (clickedButton.id.startsWith(deleteButtonPrefix)) {
        console.log('Delete button clicked');
        deleteRow(clickedId);
      } else {
        console.log("None were selected");
      }
    }
  });

  // Attach getBranches to the onclick event of the button
  const getBranchesButton = document.getElementById('getBranchesButton');
  if (getBranchesButton) {
    getBranchesButton.addEventListener('click', getBranches);
  } else {
    console.error('Button not found.');
  }

  // Call the fetchCountries function to initiate the data fetching process
  fetchCountries();

  // Add event listener for country change
  const countrySelect = document.getElementById('countrySlec');
  countrySelect.addEventListener('change', function () {
    // Call the fetchCities function when the country selection changes
    fetchCities();
  });

  // Function to fetch countries and trigger subsequent data fetching
  function fetchCountries() {
    fetch('https://arabbank.azurewebsites.net/api/COUNTRY')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(countries => {
        // Update the options in the select element
        const countrySelect = document.getElementById('countrySlec');
        countrySelect.innerHTML = ''; // Clear existing options

        countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country.countryName;
          option.textContent = country.countryName;
          countrySelect.appendChild(option);
        });

        // Trigger fetchCities directly after fetching countries
        fetchCities();
      })
      .catch(error => console.error('Error fetching countries:', error));
  }

  // Function to fetch cities and trigger subsequent data fetching
  async function fetchCities() {
    // Get the selected country
    const selectedCountry = document.getElementById('countrySlec').value;

    // Make a POST request to the API
    fetch('https://arabbank.azurewebsites.net/api/city/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedCountry)
    })
      .then(response => response.json())
      .then(data => {
        // Update the city dropdown with the new data
        const cityDropdown = document.getElementById('city');
        cityDropdown.innerHTML = ''; // Clear existing options

        data.forEach((city, index) => {
          const option = document.createElement('option');
          option.value = city.cityName;
          option.textContent = city.cityName;
          cityDropdown.appendChild(option);

          // If it's the first city, trigger fetchBranches
          if (index === 0) {
            fetchBranches();
          }
        });
      })
      .catch(error => console.error('Error fetching cities:', error));
  }

  // Function to fetch branches based on selected country and city
  function fetchBranches() {
    const selectedCountry = document.getElementById('countrySlec').value;
    const selectedCity = document.getElementById('city').value;

    const requestBody = {
      country: selectedCountry,
      city: selectedCity
    };

    fetch('https://arabbank.azurewebsites.net/api/branch/getBranchByCountry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const branchTableBody = document.getElementById('branchTable');
        branchTableBody.innerHTML = ''; // Clear existing rows

        if (data && data.length > 0) {
          data.forEach(branch => {
            const row = branchTableBody.insertRow();
            row.innerHTML = `
              <td data-id="${branch.id}">${branch.id}</td>
              <td>${branch.branchName}</td>
              <td>${branch.branchNameAr}</td>
              <td>${branch.branchNumber}</td>
              <td>
                <button type="button" id="editButton_${branch.id}" class="btn btn-outline-primary" data-branch-id="${branch.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button type="button" id="deleteButton_${branch.id}" class="btn btn-outline-danger" data-branch-id="${branch.id}">
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
        } else {
          console.warn('No branches found for the selected country and city.');
          branchTableBody.innerHTML = '<h2>No branches available<h2>';
        }
      })
      .catch(error => {
        console.error('Error fetching branches:', error);
      });
  }

  // Function to add event listeners to the table buttons
  function addEventListeners() {
    const tableBody = document.querySelector('#branchTable');

    tableBody.addEventListener('click', function (event) {
      const editButtonPrefix = 'editButton_';
      const deleteButtonPrefix = 'deleteButton_';

      const clickedButton = event.target.closest('button');

      if (clickedButton) {
        const clickedId = clickedButton.dataset.branchId;

        if (clickedButton.id.startsWith(editButtonPrefix)) {
          console.log('Edit button clicked');
          redirec_toUpdate(clickedId);
        } else if (clickedButton.id.startsWith(deleteButtonPrefix)) {
          console.log('Delete button clicked');
          deleteRow(clickedId);
        } else {
          console.log("None were selected");
        }
      }
    });
  }

  // Function to redirect to the update page
  function redirec_toUpdate(id) {
    console.log('Redirecting to update with ID:', id);
    // Construct the new URL with the parameter
    var newUrl = `update_branch.html?id=${id}`;

    // Redirect to the new URL
    window.location.href = newUrl;
  }

  // Function to delete a row
  function deleteRow(id) {
    // Make a DELETE request to the server to delete the corresponding data
    fetch(`https://arabbank.azurewebsites.net/api/branch?id=${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // If the server-side deletion is successful, remove the row from the DOM
          const row = document.querySelector(`#branchTable td[data-id="${id}"]`);
          if (row) {
            row.parentElement.remove(); // Remove the entire row
            console.log("Deleted successfully");
          } else {
            console.error('Row not found in the DOM');
          }
        } else {
          // Handle errors here if needed
          console.error('Error deleting data:', response.status);
        }
      })
      .catch(error => console.error('Error deleting data:', error));
  }
});
