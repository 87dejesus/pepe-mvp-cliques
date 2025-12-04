// A função principal que carrega os dados e renderiza as ofertas.
function loadOffers() {
    // 1. Busca os dados do arquivo offers.json
    fetch('offers.json')
        .then(response => {
            // Verifica se a resposta HTTP foi bem-sucedida (status 200)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(offersData => {
            // 2. Chama a função para exibir as ofertas carregadas
            renderOffers(offersData);
        })
        .catch(error => {
            // 3. Em caso de erro, exibe uma mensagem no console e na tela.
            console.error('Failed to load or parse offers. The file may be missing or have a syntax error:', error);

            const offersContainer = document.getElementById('offersContainer');
            if (offersContainer) {
                // Mensagem de erro neutra, removendo a frase 'Please check the syntax...'
                offersContainer.innerHTML = `
                    <div class="col-12 text-center my-5">
                        <p class="text-danger font-weight-bold">Ocorreu um erro ao carregar as ofertas. Por favor, verifique o arquivo 'offers.json'.</p>
                    </div>
                `;
            }
        });
}

// Função para renderizar as ofertas no HTML
function renderOffers(offers) {
    const offersContainer = document.getElementById('offersContainer');
    if (!offersContainer) return;

    offersContainer.innerHTML = ''; 

    // Função para formatar o valor como moeda USD
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
         offersContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">No active offers found.</p></div>';
    }
}


// ** GARANTIA DE CARREGAMENTO: Inicia a função loadOffers somente após o HTML estar pronto. **
document.addEventListener('DOMContentLoaded', loadOffers);
