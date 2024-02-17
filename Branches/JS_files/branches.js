document.addEventListener('DOMContentLoaded', function () {
  let currentBranchData;

  const tableBody = document.querySelector('#branchTable');
  const loader = document.getElementById('updateLoader');

  tableBody.addEventListener('click', function (event) {
    const editButtonPrefix = 'editButton_';
    const deleteButtonPrefix = 'deleteButton_';

    const clickedButton = event.target.closest('button');

    if (clickedButton) {
      const clickedId = clickedButton.dataset.branchId;

      if (clickedButton.id.startsWith(editButtonPrefix)) {
        console.log('Edit button clicked');
        redirecToUpdate(clickedId);
      } else if (clickedButton.id.startsWith(deleteButtonPrefix)) {
        console.log('Delete button clicked');
        deleteRow(clickedId);
      } else {
        console.log("None were selected");
      }
    }
  });

  
  fetchCountries();

  const countrySelect = document.getElementById('countrySlec');
  countrySelect.addEventListener('change', function () {
    fetchCities();
  });
  const citySelect = document.getElementById('city');
  citySelect.addEventListener('change', function () {
    fetchBranches();
  });

  function fetchCountries() {
    loader.style.display = 'block'; // Show loader before fetching countries

    fetch('https://arabbanktest.azurewebsites.net/api/COUNTRY')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(countries => {
        const countrySelect = document.getElementById('countrySlec');
        countrySelect.innerHTML = '';

        countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country.countryName;
          option.textContent = country.countryName;
          countrySelect.appendChild(option);
        });

        fetchCities(); // Trigger fetchCities directly after fetching countries
      })
      .catch(error => console.error('Error fetching countries:', error))
      .finally(() => {
        loader.style.display = 'none'; // Hide loader after fetching countries
      });
  }

  
  async function fetchCities() {
    loader.style.display = 'block'; // Show loader before fetching cities

    const selectedCountry = document.getElementById('countrySlec').value;

    fetch('https://arabbanktest.azurewebsites.net/api/city/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedCountry)
    })
      .then(response => response.json())
      .then(data => {
        const cityDropdown = document.getElementById('city');
        cityDropdown.innerHTML = '';

        data.forEach((city, index) => {
          const option = document.createElement('option');
          option.value = city.cityName;
          option.textContent = city.cityName;
          cityDropdown.appendChild(option);

          if (index === 0) {
            fetchBranches();
          }
        });
      })
      .catch(error => console.error('Error fetching cities:', error))
      .finally(() => {
        loader.style.display = 'none'; // Hide loader after fetching cities
      });
  }
  

  function fetchBranches() {
    console.log('Fetching branches...');
    const selectedCountry = document.getElementById('countrySlec').value;
    const selectedCity = document.getElementById('city').value;

    const requestBody = {
      country: selectedCountry,
      city: selectedCity
    };

    loader.style.display = 'block'; // Show loader before fetching branches
    tableBody.innerHTML = ''; // Clear existing content

    fetch('https://arabbanktest.azurewebsites.net/api/branch/getBranchByCountry', {
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
        branchTableBody.innerHTML = '';

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
      })
      .finally(() => {
        loader.style.display = 'none'; // Hide loader after fetching branches
      });
  }

  function redirecToUpdate(id) {
    console.log('Redirecting to update with ID:', id);
    var newUrl = `update_branch.html?id=${id}`;
    window.location.href = newUrl;
  }

  function deleteRow(id) {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this branch?');
  
    if (!isConfirmed) {
      return; // User clicked "Cancel" in the confirmation dialog
    }
  
    // User clicked "OK" in the confirmation dialog, proceed with the delete request
    fetch(`https://arabbanktest.azurewebsites.net/api/branch?id=${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          const row = document.querySelector(`#branchTable td[data-id="${id}"]`);
          if (row) {
            row.parentElement.remove();
            console.log('Deleted successfully');
          } else {
            console.error('Row not found in the DOM');
          }
        } else {
          console.error('Error deleting data:', response.status);
        }
      })
      .catch(error => console.error('Error deleting data:', error));
  }
  
});
