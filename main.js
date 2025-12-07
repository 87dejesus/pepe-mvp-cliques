// main.js – Pepe Deals
// Carrega offers.json, renderiza os cards em carrossel horizontal
// e deixa pronto para o filtro por cidade.

document.addEventListener('DOMContentLoaded', () => {
  const offersContainer = document.getElementById('offersContainer');
  const citySearchInput = document.getElementById('citySearch');

  let allOffers = [];

  // --- Utilidades ---

  // Pega o código do estado (FL, IL, etc.) a partir de "location"
  function getStateCode(location) {
    if (!location) return '';
    const parts = location.split(',');
    const lastPart = parts[parts.length - 1].trim();
    const match = lastPart.match(/\b([A-Z]{2})\b/);
    return match ? match[1] : '';
  }

  function formatCurrency(value) {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }

  function createCard(offer) {
    const stateCode = getStateCode(offer.location);
    const minRent = formatCurrency(offer.monthly_rent_min);
    const maxRent = offer.monthly_rent_max
      ? formatCurrency(offer.monthly_rent_max)
      : null;
    const savings = offer.monthly_savings && offer.monthly_savings > 0
      ? formatCurrency(offer.monthly_savings)
      : null;

    const card = document.createElement('div');
    card.className = 'listing-card';

    card.innerHTML = `
      <div class="listing-photo" style="background-image: url('${offer.photo_url}');">
        <span class="city-badge">${stateCode}</span>
      </div>
      <div class="listing-body">
        <p class="offer-type">💰 ${offer.discount_type}</p>
        <h3>${offer.building_name}</h3>
        <p class="location">${offer.location}</p>

        <p class="mb-1">${offer.rooms_bathrooms}</p>

        <p class="price-range">
          ${minRent}
          ${maxRent ? ` - ${maxRent}` : ''} / mo
        </p>

        ${
          savings
            ? `<p class="mb-1">Savings: <strong>${savings}</strong></p>`
            : ''
        }

        <a href="${offer.offer_url}"
           class="details-button"
           target="_blank"
           rel="noopener noreferrer">
          View Deal
        </a>

        <a href="report.html?listing=${encodeURIComponent(
          offer.building_name
        )}"
           class="d-block mt-2 text-center text-muted"
           style="font-size: 0.85rem; text-decoration: none;">
          Report Scam
        </a>
      </div>
    `;

    return card;
  }

  function renderOffers(list) {
    offersContainer.innerHTML = '';

    if (!list || list.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'col-12 text-center listing-card';
      empty.style.width = '100%';
      empty.style.border = 'none';
      empty.style.boxShadow = 'none';
      empty.innerHTML = `<p class="text-muted">No deals found for this search.</p>`;
      offersContainer.appendChild(empty);
      return;
    }

    list.forEach(offer => {
      const card = createCard(offer);
      offersContainer.appendChild(card);
    });
  }

  // --- Carrega JSON ---

  fetch('offers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load offers.json');
      }
      return response.json();
    })
    .then(data => {
      // filtra só ativos
      allOffers = (data || []).filter(o => o.is_active !== false);
      renderOffers(allOffers);
    })
    .catch(error => {
      console.error(error);
      offersContainer.innerHTML = `
        <div class="col-12 text-center listing-card" style="width: 100%; border: none; box-shadow: none;">
          <p class="text-danger">Failed to load offers. Please check the offers.json file.</p>
        </div>
      `;
    });

  // --- Filtro por cidade ---

  if (citySearchInput) {
    citySearchInput.addEventListener('input', e => {
      const term = e.target.value.trim().toLowerCase();

      if (!term) {
        renderOffers(allOffers);
        return;
      }

      const filtered = allOffers.filter(offer => {
        const city = (offer.city || '').toLowerCase();
        const location = (offer.location || '').toLowerCase();
        return city.includes(term) || location.includes(term);
      });

      renderOffers(filtered);
    });
  }
});
