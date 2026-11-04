const properties = [
  { id: 1, name: 'Luz y diseño en el corazón de Conce', city: 'Concepción', area: 'Centro', guests: 2, beds: 1, price: 48000, category: 'city', badge: 'Descubre Concepción', image: 'assets/about-banner-2.jpg' },
  { id: 2, name: 'Tu espacio junto al Parque Ecuador', city: 'Concepción', area: 'Parque Ecuador', guests: 4, beds: 2, price: 62000, category: 'family', badge: 'Concepción en familia', image: 'assets/blog-1.png' },
  { id: 3, name: 'Una pausa cerca de la universidad', city: 'Concepción', area: 'Barrio Universitario', guests: 2, beds: 1, price: 45000, category: 'city', badge: 'Descubre Concepción', image: 'assets/property-2.jpg' },
  { id: 4, name: 'Un refugio en la ciudad', city: 'Santiago', area: 'Providencia', guests: 2, beds: 1, price: 65000, category: 'city', badge: 'Escapada urbana', image: 'assets/blog-1.png' },
  { id: 5, name: 'Despierta cerca del mar', city: 'Viña del Mar', area: 'Viña del Mar', guests: 4, beds: 2, price: 85000, category: 'sea', badge: 'Cerca del mar', image: 'assets/blog-3.jpg' },
  { id: 6, name: 'Una escapada para compartir', city: 'Concón', area: 'Bosques de Montemar', guests: 6, beds: 3, price: 95000, category: 'family', badge: 'Ideal para familias', image: 'assets/property-3.jpg' },
  { id: 7, name: 'Descanso en el sur', city: 'Pucón', area: 'Pucón', guests: 4, beds: 2, price: 78000, category: 'family', badge: 'Escapada al sur', image: 'assets/about-banner-2.jpg' },
  { id: 8, name: 'Días tranquilos en la costa', city: 'La Serena', area: 'La Serena', guests: 4, beds: 2, price: 68000, category: 'sea', badge: 'Cerca del mar', image: 'assets/blog-3.jpg' }
];
const grid = document.querySelector('#property-grid');
const search = document.querySelector('#search-form');
const status = document.querySelector('#search-status');
const dialog = document.querySelector('#contact-dialog');
const contact = document.querySelector('#contact-form');
let category = 'all';
let appliedSearch = null;
const favorites = new Set();
const currency = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
function render() {
  const results = properties.filter(p => (category === 'all' || p.category === category) && (!appliedSearch || ((appliedSearch.destination === 'all' || p.city === appliedSearch.destination) && p.guests >= Number(appliedSearch.guests))));
  grid.innerHTML = results.map(p => `<article class="property-card"><div class="property-image"><a href="#alojamiento/${p.id}" class="property-open" aria-label="Ver ${p.name}"><img src="${p.image}" alt="Imagen de referencia de ${p.name}" loading="lazy"></a><span class="property-badge">${p.badge}</span><button class="favorite" data-favorite="${p.id}" aria-label="Guardar ${p.name}" aria-pressed="${favorites.has(p.id)}">${favorites.has(p.id) ? '♥' : '♡'}</button></div><p class="location">⌖ ${p.area} · ${p.city}</p><h3><a href="#alojamiento/${p.id}">${p.name}</a></h3><p class="property-details">${p.guests} huéspedes · ${p.beds} dormitorio${p.beds > 1 ? 's' : ''} · ${p.beds} baño${p.beds > 1 ? 's' : ''}</p><div class="property-bottom"><div class="property-price">${currency(p.price)} <span>/ noche</span></div><a class="details-link" href="#alojamiento/${p.id}">Ver departamento ↗</a></div></article>`).join('');
  if (appliedSearch || category !== 'all') status.textContent = results.length ? `${results.length} alojamiento${results.length > 1 ? 's' : ''} de ejemplo. Fechas y disponibilidad por confirmar.` : 'No hay alojamientos de ejemplo con esos filtros. Prueba otro destino o menos huéspedes.';
  else status.textContent = '';
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  render();
}));
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
search.elements.arrival.min = localDate;
search.elements.departure.min = localDate;
search.elements.arrival.addEventListener('change', () => {
  if (search.elements.arrival.value) {
    const next = new Date(search.elements.arrival.value + 'T12:00:00');
    next.setDate(next.getDate() + 1);
    search.elements.departure.min = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
  } else search.elements.departure.min = localDate;
  search.elements.departure.setCustomValidity('');
});
search.elements.departure.addEventListener('input', () => search.elements.departure.setCustomValidity(''));
search.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(search));
  if ((values.arrival && !values.departure) || (!values.arrival && values.departure) || (values.arrival && values.departure <= values.arrival)) {
    search.elements.departure.setCustomValidity('Selecciona llegada y salida; la salida debe ser posterior a la llegada.');
    search.elements.departure.reportValidity(); return;
  }
  search.elements.departure.setCustomValidity('');
  appliedSearch = values; render(); document.querySelector('#alojamientos').scrollIntoView({ behavior: 'smooth' });
});
document.querySelector('#show-all').addEventListener('click', () => {
  appliedSearch = null; category = 'all'; search.reset();
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('selected', b.dataset.filter === 'all'); b.setAttribute('aria-pressed', String(b.dataset.filter === 'all')); }); render();
});
function openInquiry(title, description, message = '') {
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-description').textContent = description;
  document.querySelector('#contact-result').textContent = '';
  contact.hidden = false; contact.style.display = ''; contact.reset(); contact.elements.message.value = message;
  dialog.showModal();
}
grid.addEventListener('click', event => {
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) { const id = Number(favorite.dataset.favorite); favorites.has(id) ? favorites.delete(id) : favorites.add(id); favorite.setAttribute('aria-pressed', String(favorites.has(id))); favorite.textContent = favorites.has(id) ? '♥' : '♡'; }
});
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => openInquiry(button.dataset.service, 'Cuéntanos qué necesitas y prepara tu consulta para el equipo de FES SPA.')));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
contact.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contact);
  document.querySelector('#contact-result').textContent = `Consulta preparada, ${data.get('name')}.\n\n${document.querySelector('#dialog-title').textContent}\n${data.get('message')}\nCorreo de contacto: ${data.get('email')}\n\nEsta demostración no envía consultas ni guarda datos. Falta conectar el canal de contacto de FES SPA.`;
  contact.style.display = 'none';
});
document.querySelector('#year').textContent = today.getFullYear();
document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'all')));
render();

const detail = document.querySelector('#property-detail');
let selectedProperty;
let reservation;
const photoUrl = path => path;
const nextDay = date => {
  const next = new Date(`${date}T12:00:00Z`); next.setUTCDate(next.getUTCDate() + 1); return next.toISOString().slice(0, 10);
};
function updateQuote() {
  const form = document.querySelector('#booking-form');
  if (!form) return;
  const { arrival, departure, guests } = form.elements;
  arrival.setCustomValidity(''); departure.setCustomValidity('');
  departure.min = arrival.value ? nextDay(arrival.value) : localDate;
  if (arrival.value && arrival.value < localDate) arrival.setCustomValidity('La llegada debe ser hoy o una fecha futura.');
  if (departure.value && (!arrival.value || departure.value <= arrival.value)) departure.setCustomValidity('La salida debe ser posterior a la llegada.');
  const nights = arrival.value && departure.value ? Math.round((Date.parse(departure.value) - Date.parse(arrival.value)) / 86400000) : 0;
  reservation = null;
  const quote = document.querySelector('#price-breakdown');
  const valid = nights > 0 && arrival.value >= localDate && Number(guests.value) <= selectedProperty.guests;
  if (!valid) { quote.innerHTML = '<p class="booking-hint">Selecciona tus fechas para ver el total estimado.</p>'; return; }
  const subtotal = nights * selectedProperty.price;
  const cleaning = 20000;
  const service = Math.round(subtotal * .10);
  reservation = { arrival: arrival.value, departure: departure.value, guests: guests.value, nights, subtotal, cleaning, service, total: subtotal + cleaning + service };
  quote.innerHTML = `<div><span>${currency(selectedProperty.price)} × ${nights} noche${nights === 1 ? '' : 's'}</span><span>${currency(subtotal)}</span></div><div><span>Limpieza por estadía</span><span>${currency(cleaning)}</span></div><div><span>Servicio FES (10%)</span><span>${currency(service)}</span></div><div class="quote-total"><strong>Total estimado · CLP</strong><strong>${currency(reservation.total)}</strong></div>`;
}
function route() {
  const match = location.hash.match(/^#alojamiento\/(\d+)$/);
  const p = match && properties.find(item => item.id === Number(match[1]));
  document.querySelector('main').hidden = Boolean(p);
  document.querySelector('footer').hidden = Boolean(p);
  detail.hidden = !p;
  document.title = p ? `${p.name} · ${p.city} | FES SPA` : 'FES SPA · Un buen lugar para estar';
  if (!p) return;
  selectedProperty = p; reservation = null;
  const photos = [p.image, ...['assets/about-banner-2.jpg', 'assets/blog-1.png', 'assets/property-2.jpg', 'assets/blog-3.jpg'].filter(path => path !== p.image)].slice(0, 4);
  detail.innerHTML = `<a href="#alojamientos" class="back-link">← Volver a los alojamientos</a><div class="detail-heading"><div><div class="eyebrow">${p.city === 'Concepción' ? 'CONCEPCIÓN, NUESTRO PUNTO DE PARTIDA' : 'DESCUBRE CHILE CON FES'}</div><h1>${p.name}</h1><p>⌖ ${p.area}, ${p.city}, Chile · <a href="#ubicacion">Ver ubicación</a></p></div><button class="save-detail" aria-pressed="${favorites.has(p.id)}">${favorites.has(p.id) ? '♥ Guardado' : '♡ Guardar'}</button></div><div class="detail-gallery">${photos.map((photo, i) => `<button class="gallery-photo" data-photo="${i}" aria-label="Ampliar foto ${i + 1}"><img src="${photoUrl(photo)}" alt="Foto de referencia ${i + 1} del alojamiento"></button>`).join('')}<span class="gallery-note">Fotografías de referencia · Ejemplo</span></div><div class="detail-layout"><div class="detail-info"><h2>Departamento completo en ${p.city}</h2><p>${p.guests} huéspedes · ${p.beds} dormitorio${p.beds > 1 ? 's' : ''} · ${p.beds} baño${p.beds > 1 ? 's' : ''}</p><div class="host-line"><span class="host-avatar">FES</span><div><strong>Tu estadía, acompañada por FES SPA</strong><p>Administración y cuidado de espacios</p></div></div><div class="detail-benefits"><div>⌂ <span><strong>Un espacio solo para ti</strong>Disfruta el departamento completo durante tu estadía.</span></div><div>✧ <span><strong>Preparado para tu llegada</strong>Limpieza y coordinación de ingreso en un solo lugar.</span></div><div>♡ <span><strong>Conversemos antes de tu viaje</strong>Resuelve tus dudas con el equipo de FES.</span></div></div><h2>Acerca de este espacio</h2><p class="description">Haz una pausa en ${p.area}, ${p.city}. Un departamento pensado para descansar y compartir, ya sea que viajes por trabajo o por unos días de desconexión. Revisa las fotografías, elige tus fechas y prepara tu solicitud.</p><p class="reference-note">Alojamiento de demostración. Fotografías, servicios, ubicación y tarifas ilustrativos; no hay disponibilidad real conectada.</p><h2>Lo que ofrece este espacio</h2><div class="amenities"><span>⌁ Wifi</span><span>♧ Cocina equipada</span><span>▣ Televisión</span><span>☕ Espacio para trabajar</span><span>☀ Ropa de cama</span><span>♧ Artículos de baño</span></div><section id="ubicacion"><h2>Dónde te quedarías</h2><p>${p.area}, ${p.city}, Chile</p><div class="location-placeholder"><span>⌖</span><strong>${p.city}</strong><p>Zona de referencia. La dirección exacta debe confirmarse con FES.</p></div></section><h2>Antes de reservar</h2><p class="description">Horario de ingreso, salida, reglas de la propiedad y condiciones de cancelación pendientes de definir por FES. Revísalos antes de confirmar una reserva real.</p></div><aside class="booking-panel"><div class="booking-price">${currency(p.price)} <span>CLP / noche</span></div><form id="booking-form"><div class="booking-dates"><label>LLEGADA<input type="date" name="arrival" required min="${localDate}" aria-label="Llegada de la reserva"></label><label>SALIDA<input type="date" name="departure" required min="${localDate}" aria-label="Salida de la reserva"></label></div><label class="booking-guests">HUÉSPEDES<select name="guests" aria-label="Huéspedes de la reserva">${Array.from({ length: p.guests }, (_, i) => `<option value="${i + 1}">${i + 1} huésped${i ? 'es' : ''}</option>`).join('')}</select></label><div id="price-breakdown" aria-live="polite"></div><button class="primary reserve-button" type="submit">Revisar solicitud de reserva →</button><p class="booking-hint">No se realizará ningún cobro.</p><button type="button" class="booking-help" data-help>¿Dudas con tu estadía? Te orientamos ↗</button></form><p class="reference-note">Simulación: limpieza de ${currency(20000)} y servicio del 10%. Tarifas por definir con FES.</p></aside></div>`;
  const form = document.querySelector('#booking-form');
  form.elements.arrival.value = appliedSearch?.arrival || '';
  form.elements.departure.value = appliedSearch?.departure || '';
  form.elements.guests.value = String(Math.min(p.guests, Number(appliedSearch?.guests || 2)));
  form.addEventListener('input', updateQuote);
  form.addEventListener('change', updateQuote);
  form.addEventListener('submit', event => { event.preventDefault(); updateQuote(); if (!form.reportValidity() || !reservation) return; showReview(); });
  document.querySelector('.save-detail').addEventListener('click', event => { favorites.has(p.id) ? favorites.delete(p.id) : favorites.add(p.id); event.currentTarget.textContent = favorites.has(p.id) ? '♥ Guardado' : '♡ Guardar'; event.currentTarget.setAttribute('aria-pressed', String(favorites.has(p.id))); render(); });
  detail.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    const viewer = document.createElement('dialog'); viewer.className = 'photo-viewer';
    const image = document.createElement('img'); image.src = photoUrl(photos[Number(button.dataset.photo)], 1800); image.alt = button.querySelector('img').alt;
    const close = document.createElement('button'); close.textContent = '×'; close.className = 'close-dialog'; close.setAttribute('aria-label', 'Cerrar fotografía'); close.onclick = () => viewer.close();
    viewer.append(close, image); document.body.append(viewer); viewer.addEventListener('close', () => viewer.remove()); viewer.showModal();
  }));
  FESDates.enhance(form); updateQuote(); bindHelp(detail); window.scrollTo(0, 0);
}
function showReview() {
  const r = { ...reservation }; const p = selectedProperty;
  const review = document.createElement('dialog'); review.className = 'reservation-review';
  review.innerHTML = `<button class="close-dialog" aria-label="Cerrar resumen">×</button><div class="eyebrow">REVISA TU VIAJE</div><h2>Tu próxima pausa en ${p.city}</h2><p><strong>${p.name}</strong></p><div class="review-trip"><div><strong>Fechas</strong><span>${new Date(r.arrival + 'T12:00:00').toLocaleDateString('es-CL')} → ${new Date(r.departure + 'T12:00:00').toLocaleDateString('es-CL')} · ${r.nights} noches</span></div><div><strong>Huéspedes</strong><span>${r.guests}</span></div></div><div class="review-cost"><p>Alojamiento <span>${currency(r.subtotal)}</span></p><p>Limpieza <span>${currency(r.cleaning)}</span></p><p>Servicio FES (10%) <span>${currency(r.service)}</span></p><p><strong>Total estimado · CLP</strong><strong>${currency(r.total)}</strong></p></div><p class="reference-note">Esta es una simulación. No confirma disponibilidad, no bloquea fechas ni realiza cobros.</p><button class="primary" id="continue-request">Continuar con mis datos →</button>`;
  document.body.append(review); review.querySelector('.close-dialog').onclick = () => review.close(); review.addEventListener('close', () => review.remove());
  review.querySelector('#continue-request').onclick = () => { review.close(); openInquiry(`Solicitud: ${p.name}`, `Revisa tus datos para preparar tu solicitud. Total estimado: ${currency(r.total)} CLP. No se confirma una reserva.`, `Alojamiento: ${p.name}, ${p.city}.\nLlegada: ${r.arrival}. Salida: ${r.departure}.\n${r.guests} huéspedes · ${r.nights} noches.\nAlojamiento: ${currency(r.subtotal)}. Limpieza: ${currency(r.cleaning)}. Servicio FES: ${currency(r.service)}.\nTotal estimado: ${currency(r.total)} CLP.`); };
  review.showModal();
}



const helpDialog = document.querySelector('#help-dialog');
function bindHelp(root) {
  root.querySelectorAll('[data-help]').forEach(button => button.addEventListener('click', () => helpDialog.showModal()));
}
bindHelp(document);
helpDialog.querySelector('.close-help').addEventListener('click', () => helpDialog.close());
helpDialog.addEventListener('click', event => {
  if (event.target !== helpDialog) return;
  const r = helpDialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) helpDialog.close();
});
helpDialog.querySelectorAll('[data-help-topic]').forEach(button => button.addEventListener('click', () => {
  helpDialog.close();
  const topic = button.dataset.helpTopic;
  const context = !detail.hidden && selectedProperty ? `Mi consulta es sobre ${selectedProperty.name}, en ${selectedProperty.city}.` : '';
  openInquiry(topic, 'Cuéntanos qué necesitas. Esta versión prepara tu consulta; el envío directo está pendiente de configurar.', context);
}));
FESDates.enhance(search);
window.addEventListener('hashchange', route);
route();
