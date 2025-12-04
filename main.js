let allOffers = []; // Variável global para armazenar todas as ofertas

// A função principal que carrega os dados
function loadOffers() {
    fetch('offers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(offersData => {
            allOffers = offersData; // Armazena os dados globalmente
            renderOffers(allOffers); // Renderiza todas as ofertas inicialmente
            setupSearchListener(); // Configura o filtro após o carregamento
        })
        .catch(error => {
            console.error('Failed to load or parse offers:', error);
            const offersContainer = document.getElementById('offersContainer');
            if (offersContainer) {
                offersContainer.innerHTML = `
                    <div class="col-12 text-center my-5">
                        <p class="text-danger font-weight-bold">Ocorreu um erro ao carregar as ofertas. Por favor, verifique o arquivo 'offers.json'.</p>
                    </div>
                `;
            }
        });
}

// NOVO: Função para configurar o Listener de Busca
function setupSearchListener() {
    const searchInput = document.getElementById('citySearch');
    if (searchInput) {
        // Escuta o evento 'input' (dispara a cada tecla digitada)
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            filterOffers(searchTerm);
        });
    }
}

// NOVO: Função para filtrar as ofertas
function filterOffers(searchTerm) {
    const filteredOffers = allOffers.filter(offer => 
        // Filtra por cidade (case-insensitive)
        offer.city.toLowerCase().includes(searchTerm) ||
        // Opcional: Filtra também por nome do prédio
        offer.building_name.toLowerCase().includes(searchTerm)
    );
    renderOffers(filteredOffers);
}


// Função para renderizar as ofertas no HTML (inalterada)
function renderOffers(offers) {
    const offersContainer = document.getElementById('offersContainer');
    if (!offersContainer) return;

    offersContainer.innerHTML = ''; 

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
    };

    const activeOffers = offers.filter(offer => offer.is_active);

    activeOffers.forEach(offer => {
        const savingsText = offer.monthly_savings > 0 ? `<p class="savings-text">Savings: ${formatCurrency(offer.monthly_savings)}</p>` : '';
        const rentDisplay = offer.monthly_rent_max > 0 && offer.monthly_rent_min !== offer.monthly_rent_max
            ? `${formatCurrency(offer.monthly_rent_min)} - ${formatCurrency(offer.monthly_rent_max)}`
            : formatCurrency(offer.monthly_rent_min);

        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img src="${offer.photo_url}" class="card-img-top" alt="${offer.building_name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${offer.building_name}</h5>
                    <p class="card-text text-muted mb-1">${offer.location}</p>
                    <p class="card-text rooms-bath">${offer.rooms_bathrooms}</p>
                    <h6 class="price-range">${rentDisplay} / mo</h6>
                    <span class="badge bg-success mb-2">${offer.discount_type}</span>
                    ${savingsText}
                    <div class="mt-auto">
                        <a href="${offer.offer_url}" target="_blank" class="btn btn-primary w-100">View Deal</a>
                    </div>
                </div>
            </div>
        `;
        offersContainer.appendChild(card);
    });
    
    if (activeOffers.length === 0) {
         offersContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">No active offers found for this search.</p></div>';
    }
}


// GARANTIA DE CARREGAMENTO: Inicia a função loadOffers somente após o HTML estar pronto.
document.addEventListener('DOMContentLoaded', loadOffers);
