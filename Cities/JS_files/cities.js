document.addEventListener('DOMContentLoaded', function () {

    const loader = document.getElementById('loader');
    loader.style.display = 'block';

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
                window.location.href = './update_city.html?id=' + clickedId;
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
        fetch('https://arabbanktest.azurewebsites.net/api/COUNTRY')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(countries => {
                const countrySelect = document.getElementById('countrySlec');
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.countryName;
                    option.textContent = country.countryName;
                    countrySelect.appendChild(option);
                });
                countrySelect.value = countries[0].countryName;

                const firstCountry = countries[0].countryName;
                fetchCities(firstCountry);

                // Hide the loader after data is fetched
                loader.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
                // Hide the loader in case of an error
                loader.style.display = 'none';
            });
    }
    function deleteRow(id) {
        // Display a confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete this city?");
    
        if (isConfirmed) {
            // If the user confirms, remove the row from the DOM immediately
            const row = document.querySelector(`#cityTable td[data-id="${id}"]`);
            if (row) {
                row.parentElement.remove(); // Remove the entire row
            } else {
                console.error('Row not found in the DOM');
            }
    
            // Make a DELETE request to the server to delete the corresponding data
            fetch(`https://arabbanktest.azurewebsites.net/api/city?id=${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete data. Server responded with status: ${response.status}, Message: ${response.statusText}`);
                }
                console.log("Deleted successfully");
            })
            .catch(error => console.error('Error deleting data:', error));
        }
    }

    function fetchCities(selectedCountry) {
        const countryToFetch = selectedCountry || document.getElementById('countrySlec').value;
    
        if (!countryToFetch) {
            return;
        }
    
        const loader = document.getElementById('loader');
        loader.style.display = 'block'; // Show the loader while fetching data
    
        const tableBody = document.getElementById('cityTable');
        tableBody.innerHTML = ''; // Clear existing data
    
        fetch('https://arabbanktest.azurewebsites.net/api/city/filter', {
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
            if (Array.isArray(data)) {
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
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            loader.style.display = 'none'; // Hide the loader after the fetch operation, regardless of success or failure
        });
    }
}
);
