// main.js – versão limpa para trabalhar com o seu offers.json atual

document.addEventListener('DOMContentLoaded', () => {
  const containerId = 'all-deals-container'; // TROQUE aqui se seu id for outro
  const errorId = 'all-deals-error';         // opcional, se tiver um <p> só para erro

  const dealsContainer = document.getElementById(containerId);
  const errorElement = document.getElementById(errorId);

  function showError(message) {
    console.error(message);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    if (dealsContainer) {
      dealsContainer.innerHTML = '';
    }
  }

  function formatCurrency(value) {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  function renderAllDeals(offers) {
    if (!dealsContainer) {
      console.warn('Deals container not found. Check the containerId in main.js.');
      return;
    }

    // limpa o conteúdo (inclusive aquela mensagem vermelha fixa, se estiver dentro)
    dealsContainer.innerHTML = '';

    offers.forEach((offer) => {
      const col = document.createElement('div');
      // ajuste essas classes se seu grid usar outra combinação
      col.className = 'col-md-3 mb-4';

      const minPrice = formatCurrency(offer.monthly_rent_min);
      const maxPrice = offer.monthly_rent_max
        ? formatCurrency(offer.monthly_rent_max)
        : null;
      const savings = offer.monthly_savings
        ? formatCurrency(offer.monthly_savings)
        : null;

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${offer.photo_url}" class="card-img-top" alt="${offer.building_name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${offer.building_name}</h5>
            <p class="card-text mb-1">${offer.location}</p>
            <p class="card-text fw-semibold mb-1">${offer.rooms_bathrooms}</p>
            <p class="card-text mb-1">
              ${
                maxPrice
                  ? `${minPrice} – ${maxPrice} / mo`
                  : `${minPrice} / mo`
              }
            </p>
            <div class="badge bg-success mb-2">${offer.discount_type}</div>
            ${
              savings
                ? `<p class="card-text mb-2">Savings: <strong>${savings}</strong></p>`
                : ''
            }
            <div class="mt-auto">
              <a href="${offer.offer_url}"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="btn btn-primary w-100">
                View Deal
              </a>
            </div>
          </div>
        </div>
      `;

      dealsContainer.appendChild(col);
    });
  }

  // carrega o offers.json
  fetch('offers.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((offers) => {
      if (!Array.isArray(offers)) {
        throw new Error('offers.json is not an array');
      }

      const activeOffers = offers.filter((o) => o.is_active !== false);

      if (!activeOffers.length) {
        showError('No active offers found.');
        return;
      }

      renderAllDeals(activeOffers);
    })
    .catch((error) => {
      showError('Failed to load offers. Please check the offers.json file.');
      console.error('Error loading offers.json:', error);
    });
});
