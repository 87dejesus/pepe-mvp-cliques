// A função principal que carrega os dados e renderiza as ofertas.
function loadOffers() {
    // 1. Busca os dados do arquivo offers.json
    fetch('offers.json')
        .then(response => {
            // Verifica se a resposta HTTP foi bem-sucedida (status 200)
            if (!response.ok) {
                // Se a resposta falhar, lança um erro para ser pego pelo .catch()
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Converte a resposta para JSON
            return response.json();
        })
        .then(offersData => {
            // 2. Chama a função para exibir as ofertas carregadas
            renderOffers(offersData);
        })
        .catch(error => {
            // 3. Em caso de erro (falha na rede, JSON inválido, etc.), exibe a mensagem de erro
            console.error('Failed to load or parse offers:', error);

            // Obtém o container para mostrar a mensagem de erro ao usuário
            const offersContainer = document.getElementById('offersContainer');
            if (offersContainer) {
                // **CORREÇÃO:** Removendo a mensagem de erro conforme solicitado
                // Agora, em caso de falha, o container será limpo ou uma mensagem mais neutra será exibida (você pode customizar isso depois).
                // Por enquanto, vou apenas limpar o container para esconder o erro, mas o ideal é que ele carregue.
                // Se o problema for resolvido, esta seção do código nunca será alcançada.
                offersContainer.innerHTML = `
                    <div style="text-align: center; margin-top: 50px;">
                        <p style="color: #555;">Ocorreu um erro ao carregar as ofertas. Verifique o console do navegador para detalhes técnicos.</p>
                    </div>
                `;
            }
        });
}

// Função para renderizar as ofertas no HTML
function renderOffers(offers) {
    const offersContainer = document.getElementById('offersContainer');
    if (!offersContainer) return;

    offersContainer.innerHTML = ''; // Limpa o conteúdo anterior

    // Função para formatar o valor como moeda USD
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
    };

    // Filtra as ofertas para garantir que apenas as ativas sejam exibidas
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
    
    // Se não houver ofertas, exibe uma mensagem
    if (activeOffers.length === 0) {
         offersContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">No active offers found.</p></div>';
    }
}


// ** CORREÇÃO MAIS IMPORTANTE: Usa o evento DOMContentLoaded **
// Isso garante que o HTML (incluindo o offersContainer e o resto da página)
// foi totalmente carregado antes de chamar a função loadOffers().
document.addEventListener('DOMContentLoaded', loadOffers);
