document.addEventListener('DOMContentLoaded', () => {
    const offersContainer = document.getElementById('offers-container');
    
    // VERIFICAÇÃO DE SEGURANÇA CRÍTICA: Só executa o resto se for a página index.
    if (!offersContainer) { 
        return; 
    }
    
    // O restante do código só roda se estivermos na página correta.
    fetch('offers.json')
        .then(response => {
            if (!response.ok) {
                console.error('Network response was not ok:', response.status, response.statusText);
                throw new Error('Could not load offers.json or response status not OK.');
            }
            return response.json();
        })
        .then(offersData => {
            window.allOffers = offersData;
            displayOffers(offersData);
            const searchInput = document.getElementById('city-search');
            if (searchInput) {
                searchInput.addEventListener('keyup', filterOffers);
            }
        })
        .catch(error => {
            console.error('Fatal Error loading offers:', error);
            offersContainer.innerHTML = '<p class="text-danger mt-5">Oops! Error loading offers. Please check the syntax of your offers.json file, or ensure the file exists and is accessible.</p>';
        });

    function displayOffers(offers) {
        offersContainer.innerHTML = '';

        if (offers.length === 0) {
            offersContainer.innerHTML = '<p class="text-center mt-5">Nenhuma oferta encontrada para sua pesquisa. Tente buscar por uma cidade ou nome de edifício diferente.</p>';
            return;
        }

        offers.forEach(offer => {
            const card = `
                <div class="col-lg-4 col-md-6 mb-4 offer-card">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${offer.photo_url}" class="card-img-top" alt="${offer.building_name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-primary">${offer.building_name}</h5>
                            <p class="card-text text-muted small">${offer.location} | ${offer.rooms_bathrooms}</p>
                            
                            <div class="mt-auto pt-2">
                                <p class="mb-1">Monthly Rent: <strong>$${offer.monthly_rent_min.toFixed(2)} - $${offer.monthly_rent_max.toFixed(2)}</strong></p>
                                <p class="mb-1 text-success">You can save up to **$${offer.monthly_savings.toFixed(2)}** on your lease.</p>
                                <div class="alert alert-warning py-1 px-2 text-center small mt-2" role="alert">
                                    ${offer.discount_type}
                                </div>
                                <a href="${offer.offer_url}" target="_blank" class="btn btn-success btn-block mt-2">VIEW OFFER (Tracked)</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            offersContainer.innerHTML += card;
        });
    }

    function filterOffers() {
        const searchTerm = document.getElementById('city-search').value.toLowerCase();
        
        const filteredOffers = window.allOffers.filter(offer => {
            const city = offer.city.toLowerCase();
            const buildingName = offer.building_name.toLowerCase();
            
            return city.includes(searchTerm) || buildingName.includes(searchTerm);
        });

        displayOffers(filteredOffers);
    }
});
