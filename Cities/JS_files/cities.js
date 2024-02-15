document.addEventListener('DOMContentLoaded', function () {
    // Fetch countries and cities as soon as the page loads
    fetchCountriesAndCities();
  
    // Event delegation for dynamically added buttons
    const tableBody = document.querySelector('#cityTable');
  
    tableBody.addEventListener('click', function (event) {
        const editButtonPrefix = 'editButton_';
        const deleteButtonPrefix = 'deleteButton_';
  
        const clickedButton = event.target.closest('button');
  
        if (clickedButton) {
            const clickedId = clickedButton.dataset.cityId;
  
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
  
    // Attach fetchCities to the onchange event of the dropdown
    const selectDropdown = document.getElementById('countrySlec');
    if (selectDropdown) {
        selectDropdown.addEventListener('change', function () {
            const selectedCountry = selectDropdown.value;
            fetchCities(selectedCountry);
        });
    } else {
        console.error('Dropdown not found.');
    }
  
    // Initial fetch when the page loads
    function fetchCountriesAndCities() {
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
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.countryName;
                    option.textContent = country.countryName;
                    countrySelect.appendChild(option);
                });
  
                // Set the default value of the dropdown to the first country's name
                countrySelect.value = countries[0].countryName;
  
                // Fetch cities for the first country
                const firstCountry = countries[0].countryName;
                fetchCities(firstCountry);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }
  
    function fetchCities(selectedCountry) {
        // Use the selectedCountry parameter if provided, otherwise use the dropdown value
        const countryToFetch = selectedCountry || document.getElementById('countrySlec').value;
  
        if (!countryToFetch) {
            // If no country is selected, do nothing
            return;
        }
  
        console.log('Request Payload:', JSON.stringify(countryToFetch));
  
        fetch('https://arabbank.azurewebsites.net/api/city/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(countryToFetch),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Check if the response is an array
                if (Array.isArray(data)) {
                    // Update the table with fetched data
                    const tableBody = document.getElementById('cityTable');
                    if (!tableBody) {
                        console.error('Table body not found.');
                        return;
                    }
  
                    tableBody.innerHTML = ''; // Clear existing rows
  
                    data.forEach(city => {
                        const row = tableBody.insertRow();
                        row.innerHTML = `
                            <td data-id="${city.id}">${city.id}</td>
                            <td>${city.cityName}</td>
                            <td>${city.cityNameAR}</td>
                            <td>
                                <button type="button" id="editButton_${city.id}" class="btn btn-outline-primary" data-city-id="${city.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                                </button>
                                <button type="button" id="deleteButton_${city.id}" class="btn btn-outline-danger" data-city-id="${city.id}">
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
                    console.error('Invalid response format:', data);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }
  });
  