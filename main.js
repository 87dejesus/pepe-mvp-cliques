// main.js – versão limpa para o MVP do Pepe

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('offersContainer');

  if (!track) {
    console.error('offersContainer not found in the DOM.');
    return;
  }

  function formatCurrency(value) {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  function renderOffers(offers) {
    // remove o "Loading offers..."
    track.innerHTML = '';

    const activeOffers = offers.filter(o => o.is_active !== false);

    if (!activeOffers.length) {
      track.innerHTML = `
        <div class="listing-card" style="width: 100%; border: none; box-shadow: none;">
          <p class="text-muted text-center">No active deals available right now.</p>
        </div>
      `;
      return;
    }

    activeOffers.forEach(offer => {
      const minPrice = formatCurrency(offer.monthly_rent_min);
      const maxPrice = offer.monthly_rent_max
        ? formatCurrency(offer.monthly_rent_max)
        : null;
      const savings = offer.monthly_savings && offer.monthly_savings > 0
        ? formatCurrency(offer.monthly_savings)
        : null;

      const card = document.createElement('div');
      card.className = 'listing-card';

      card.innerHTML = `
        <div class="listing-photo" style="background-image: url('${offer.photo_url}');">
          <span class="city-badge">${
            offer.city === 'Chicago' ? 'IL' : 'FL'
          }</span>
        </div>

        <div class="listing-body">
          <p class="offer-type">💰 ${offer.discount_type}</p>
          <h3>${offer.building_name}</h3>
          <p class="location">${offer.location}</p>

          <div class="details-row">
            <p>${offer.rooms_bathrooms}</p>
          </div>

          <p class="price-range">
            ${
              maxPrice
                ? `${minPrice} - ${maxPrice} / mo`
                : `${minPrice} / mo`
            }
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
        </div>
      `;

      track.appendChild(card);
    });
  }

  // carrega o arquivo offers.json na mesma pasta do index.html
  fetch('offers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('offers.json is not an array');
      }
      renderOffers(data);
    })
    .catch(error => {
      console.error('Error loading offers.json:', error);
      track.innerHTML = `
        <div class="listing-card" style="width: 100%; border: none; box-shadow: none;">
          <p class="text-danger text-center">
            Failed to load offers. Please check the offers.json file.
          </p>
        </div>
      `;
    });
});
