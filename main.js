// main.js – versão com filtro por cidade e botão "Report Scam"

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('offersContainer');
  const searchInput = document.getElementById('citySearch');

  if (!track) {
    console.error('offersContainer not found in the DOM.');
    return;
  }

  let allOffers = []; // armazena todas as ofertas ativas

  function formatCurrency(value) {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  function renderOffers(offers) {
    track.innerHTML = '';

    if (!offers.length) {
      track.innerHTML = `
        <div class="listing-card" style="width: 100%; border: none; box-shadow: none;">
          <p class="text-muted text-center">No deals found for this search.</p>
        </div>
      `;
      return;
    }

    offers.forEach(offer => {
      const minPrice = formatCurrency(offer.monthly_rent_min);
      const maxPrice = offer.monthly_rent_max
        ? formatCurrency(offer.monthly_rent_max)
        : null;
      const savings = offer.monthly_savings && offer.monthly_savings > 0
        ? formatCurrency(offer.monthly_savings)
        : null;

      const card = document.createElement('div');
      card.className = 'listing-card';

      // Badge simples: IL para Chicago, FL para o resto
      const badge = offer.city === 'Chicago' ? 'IL' : 'FL';

      card.innerHTML = `
        <div class="listing-photo" style="background-image: url('${offer.photo_url}');">
          <span class="city-badge">${badge}</span>
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

          <p class="report-link">
            <a href="report.html?listing=${offer.id}" class="text-muted small">Report Scam</a>
          </p>
        </div>
      `;

      track.appendChild(card);
    });
  }

  // carrega todas as ofertas
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

      // pega só as ativas
      allOffers = data.filter(o => o.is_active !== false);

      renderOffers(allOffers);

      // ativa o filtro por cidade
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const q = searchInput.value.trim().toLowerCase();

          if (q === '') {
            renderOffers(allOffers);
            return;
          }

          const filtered = allOffers.filter(o => {
            const city = (o.city || '').toLowerCase();
            const location = (o.location || '').toLowerCase();
            return city.includes(q) || location.includes(q);
          });

          renderOffers(filtered);
        });
      }
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
