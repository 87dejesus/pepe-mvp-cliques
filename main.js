document.addEventListener('DOMContentLoaded', () => {
    // Função principal para carregar e exibir as ofertas
    const loadOffers = async () => {
        try {
            // 1. Fetch dos dados do offers.json
            const response = await fetch('offers.json');
            const allOffers = await response.json();
            
            // 2. FILTRAGEM OBRIGATÓRIA: Usar apenas ofertas com "is_active": true
            const activeOffers = allOffers.filter(offer => offer.is_active === true);
            
            // 3. Elemento onde as ofertas principais serão injetadas:
            const offersContainer = document.getElementById('offersContainer');

            // 4. Função para renderizar um card de oferta
            const renderOfferCard = (offer) => {
                // Remove o 'bd / ba' para que o texto fique mais limpo no card
                const roomsBathrooms = offer.rooms_bathrooms.replace(/bd \/|ba/g, '').trim();
                
                // Cria o HTML do card usando a classe 'listing-card' e target="_blank"
                return `
                    <div class="listing-card">
                        <div class="listing-photo" style="background-image: url('${offer.photo_url}');">
                            <span class="city-badge">${offer.location.includes('FL') ? 'FL' : 'IL'}</span>
                        </div>
                        
                        <div class="listing-body">
                            <p class="offer-type">💰 ${offer.discount_type}</p>
                            <h3>${offer.building_name}</h3>
                            <p class="location">${offer.location}</p>
                            
                            <div class="details-row">
                                <p>Bed: ${roomsBathrooms.split('/')[0].trim()}</p>
                                <p>Bath: ${roomsBathrooms.split('/')[1].trim()}</p>
                            </div>
                            
                            <p class="price-range">Min: $${offer.monthly_rent_min.toFixed(2)}</p>
                            <a href="${offer.offer_url}" class="details-button" target="_blank" rel="noopener noreferrer">Details</a>
                        </div>
                    </div>
                `;
            };

            // 5. Carregar TODAS as ofertas ATIVAS para a listagem principal
            let mainOffers = activeOffers;
            
            // Ordena as ofertas por city (para agrupar), depois por rent_min
            mainOffers.sort((a, b) => {
                if (a.city < b.city) return -1;
                if (a.city > b.city) return 1;
                return a.monthly_rent_min - b.monthly_rent_min;
            });


            // 6. Gera o HTML de todos os cards da listagem principal
            const offersHtml = mainOffers.map(renderOfferCard).join('');
            
            // 7. Injeta o HTML no container
            offersContainer.innerHTML = offersHtml;

        } catch (error) {
            console.error('Error loading offers:', error);
            // Mensagem de erro amigável (em inglês, conforme regra)
            offersContainer.innerHTML = '<p class="text-danger">Failed to load offers. Please check the offers.json file.</p>';
        }
    };
    
    // 8. Lógica de Busca (Corrigida para usar apenas ofertas ativas)
    document.getElementById('citySearch').addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        
        // Recarrega e filtra todos os dados para obter ofertas ativas
        const response = await fetch('offers.json');
        const allOffers = await response.json();
        
        // Filtra por is_active: true
        const activeOffers = allOffers.filter(offer => offer.is_active === true); 

        const offersContainer = document.getElementById('offersContainer');

        const filteredOffers = activeOffers.filter(offer => 
            offer.city.toLowerCase().includes(query) || 
            offer.building_name.toLowerCase().includes(query) ||
            offer.location.toLowerCase().includes(query)
        );

        // Renderiza as ofertas filtradas (usando o novo template de card)
        const renderOfferCard = (offer) => {
             const roomsBathrooms = offer.rooms_bathrooms.replace(/bd \/|ba/g, '').trim();
                return `
                    <div class="listing-card">
                        <div class="listing-photo" style="background-image: url('${offer.photo_url}');">
                            <span class="city-badge">${offer.location.includes('FL') ? 'FL' : 'IL'}</span>
                        </div>
                        
                        <div class="listing-body">
                            <p class="offer-type">💰 ${offer.discount_type}</p>
                            <h3>${offer.building_name}</h3>
                            <p class="location">${offer.location}</p>
                            
                            <div class="details-row">
                                <p>Bed: ${roomsBathrooms.split('/')[0].trim()}</p>
                                <p>Bath: ${roomsBathrooms.split('/')[1].trim()}</p>
                            </div>
                            
                            <p class="price-range">Min: $${offer.monthly_rent_min.toFixed(2)}</p>
                            <a href="${offer.offer_url}" class="details-button" target="_blank" rel="noopener noreferrer">Details</a>
                        </div>
                    </div>
                `;
        };

        if (filteredOffers.length > 0) {
            offersContainer.innerHTML = filteredOffers.map(renderOfferCard).join('');
        } else {
            // Garante que a mensagem de 'não encontrado' não quebre o layout
            offersContainer.innerHTML = '<p class="text-muted listing-card" style="width: 100%; border: none; box-shadow: none;">No offers found matching your search criteria.</p>';
        }
    });

    // Chama a função para carregar as ofertas ao iniciar a página
    loadOffers();
});
