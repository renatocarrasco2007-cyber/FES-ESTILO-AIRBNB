/* Shared arrival/departure picker. Uses the existing form values and validation. */
(() => {
  const dayMs = 86400000;
  const parse = value => new Date(`${value}T12:00:00Z`);
  const iso = date => date.toISOString().slice(0, 10);
  const addDays = (value, amount) => { const date = parse(value); date.setUTCDate(date.getUTCDate() + amount); return iso(date); };
  const currentDay = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
  const monthOf = value => { const date = parse(value); date.setUTCDate(1); return date; };
  const monthLabel = date => new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
  const fullLabel = value => new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parse(value));
  const shortLabel = value => value ? new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parse(value)) : 'Agregar fecha';
  const modal = document.createElement('dialog');
  modal.id = 'date-picker'; modal.className = 'date-picker'; modal.setAttribute('aria-labelledby', 'calendar-title');
  document.body.append(modal);
  const mobile = matchMedia('(max-width: 650px)');
  let owner, fields, draft, stage, month, returnFocus;
  const monthsVisible = () => mobile.matches ? 1 : 2;
  function validRange() { return draft.arrival >= currentDay() && draft.departure > draft.arrival; }
  function monthHTML(date) {
    const year = date.getUTCFullYear(), index = date.getUTCMonth();
    const leading = (date.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, index + 1, 0)).getUTCDate();
    const cells = Array.from({ length: leading }, () => '<span class="calendar-empty" aria-hidden="true"></span>');
    for (let day = 1; day <= days; day++) {
      const value = iso(new Date(Date.UTC(year, index, day, 12)));
      const disabled = value < currentDay() || (stage === 'departure' && draft.arrival && value <= draft.arrival);
      const start = value === draft.arrival, end = value === draft.departure;
      const between = draft.arrival && draft.departure && value > draft.arrival && value < draft.departure;
      const selected = start || end;
      const label = `${fullLabel(value)}${start ? ', llegada' : end ? ', salida' : ''}`;
      cells.push(`<span class="calendar-cell${between ? ' in-range' : ''}${start ? ' range-start' : ''}${end ? ' range-end' : ''}"><button type="button" class="calendar-day${selected ? ' chosen' : ''}${value === currentDay() ? ' today' : ''}" data-date="${value}" aria-label="${label}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}>${day}</button></span>`);
    }
    return `<section class="calendar-month" aria-label="${monthLabel(date)}"><h3>${monthLabel(date)}</h3><div class="calendar-week" aria-hidden="true">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => `<span>${day}</span>`).join('')}</div><div class="calendar-days">${cells.join('')}</div></section>`;
  }
  function draw(focusDate) {
    const count = monthsVisible();
    const months = Array.from({ length: count }, (_, offset) => new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + offset, 1, 12)));
    const previousDisabled = month <= monthOf(currentDay());
    const nights = validRange() ? Math.round((parse(draft.departure) - parse(draft.arrival)) / dayMs) : 0;
    modal.innerHTML = `<header class="calendar-header"><div><div class="eyebrow">PLANIFICA TU ESTADÍA</div><h2 id="calendar-title">Elige tus fechas</h2></div><button type="button" class="calendar-close" aria-label="Cerrar calendario">×</button></header><div class="calendar-selection"><button type="button" data-stage="arrival" aria-pressed="${stage === 'arrival'}"><small>LLEGADA</small><strong>${shortLabel(draft.arrival)}</strong></button><span aria-hidden="true">→</span><button type="button" data-stage="departure" aria-pressed="${stage === 'departure'}"><small>SALIDA</small><strong>${shortLabel(draft.departure)}</strong></button></div><p class="calendar-instruction" role="status">${stage === 'arrival' ? 'Selecciona el día de tu llegada.' : draft.arrival ? 'Ahora elige una salida posterior a tu llegada.' : 'Primero elige el día de tu llegada.'}</p><div class="calendar-navigation"><button type="button" data-month="-1" aria-label="Mes anterior" ${previousDisabled ? 'disabled' : ''}>←</button><span>${count === 2 ? 'Selecciona tu llegada y salida' : month.getUTCFullYear()}</span><button type="button" data-month="1" aria-label="Mes siguiente">→</button></div><div class="calendar-months">${months.map(monthHTML).join('')}</div><footer class="calendar-footer"><div><strong class="calendar-nights" role="status">${nights ? `${nights} noche${nights === 1 ? '' : 's'}` : 'Tu viaje empieza aquí'}</strong><button type="button" class="calendar-clear">Borrar fechas</button></div><button type="button" class="primary calendar-apply" ${validRange() ? '' : 'disabled'}>Aplicar fechas</button></footer><p class="calendar-disclaimer">La disponibilidad del alojamiento está por confirmar.</p>`;
    if (focusDate) modal.querySelector(`[data-date="${focusDate}"]:not(:disabled)`)?.focus();
  }
  function sync(form) {
    form.querySelectorAll('.date-trigger').forEach(button => { button.textContent = shortLabel(form.elements[button.dataset.dateField].value); button.classList.toggle('has-date', Boolean(form.elements[button.dataset.dateField].value)); });
  }
  function open(form, field, trigger) {
    owner = form; fields = { arrival: form.elements.arrival, departure: form.elements.departure };
    draft = { arrival: fields.arrival.value, departure: fields.departure.value };
    stage = field === 'departure' && !draft.arrival ? 'arrival' : field;
    const initial = draft[field] || draft.arrival || currentDay();
    month = monthOf(initial < currentDay() ? currentDay() : initial);
    returnFocus = trigger; trigger.setAttribute('aria-expanded', 'true');
    draw(); modal.showModal();
    const first = modal.querySelector(`[data-date="${initial}"]:not(:disabled)`) || modal.querySelector('.calendar-day:not(:disabled)');
    first?.focus();
  }
  function commit(clear = false) {
    fields.arrival.value = clear ? '' : draft.arrival;
    fields.departure.value = clear ? '' : draft.departure;
    for (const input of Object.values(fields)) { input.setCustomValidity(''); input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); }
    sync(owner); modal.close();
  }
  modal.addEventListener('click', event => {
    if (event.target.closest('.calendar-close')) return modal.close();
    if (event.target.closest('.calendar-apply') && validRange()) return commit();
    if (event.target.closest('.calendar-clear')) return commit(true);
    const stageButton = event.target.closest('[data-stage]');
    if (stageButton) { stage = stageButton.dataset.stage === 'departure' && !draft.arrival ? 'arrival' : stageButton.dataset.stage; draw(); modal.querySelector(`[data-stage="${stageButton.dataset.stage}"]`).focus(); return; }
    const nav = event.target.closest('[data-month]');
    if (nav && !nav.disabled) { month.setUTCMonth(month.getUTCMonth() + Number(nav.dataset.month)); draw(); modal.querySelector(`[data-month="${nav.dataset.month}"]`).focus(); return; }
    const day = event.target.closest('[data-date]');
    if (day && !day.disabled) {
      const value = day.dataset.date;
      if (stage === 'arrival') { draft.arrival = value; if (draft.departure <= value) draft.departure = ''; stage = 'departure'; }
      else { draft.departure = value; }
      draw();
      if (validRange()) modal.querySelector('.calendar-apply').focus();
      else (modal.querySelector(`[data-date="${addDays(value, 1)}"]:not(:disabled)`) || modal.querySelector('[data-month="1"]')).focus();
      return;
    }
    if (event.target === modal) { const r = modal.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close(); }
  });
  modal.addEventListener('keydown', event => {
    const day = event.target.closest('[data-date]'); if (!day) return;
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const value = addDays(day.dataset.date, moves[event.key]);
    const min = stage === 'departure' && draft.arrival ? addDays(draft.arrival, 1) : currentDay();
    if (value < min) return;
    const date = parse(value), last = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + monthsVisible(), 1));
    if (date < month || date >= last) month = monthOf(value);
    draw(value);
  });
  modal.addEventListener('close', () => { returnFocus?.setAttribute('aria-expanded', 'false'); if (returnFocus?.isConnected) returnFocus.focus(); });
  mobile.addEventListener('change', () => { if (modal.open) draw(); });
  window.addEventListener('hashchange', () => { if (modal.open) modal.close(); });
  function enhance(form) {
    if (!form || form.dataset.calendarReady) return;
    form.dataset.calendarReady = 'true';
    for (const name of ['arrival', 'departure']) {
      const input = form.elements[name];
      input.classList.add('calendar-native'); input.tabIndex = -1; input.setAttribute('aria-hidden', 'true');
      const button = document.createElement('button'); button.type = 'button'; button.className = 'date-trigger'; button.dataset.dateField = name;
      button.setAttribute('aria-label', name === 'arrival' ? 'Seleccionar fecha de llegada' : 'Seleccionar fecha de salida'); button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-controls', 'date-picker'); button.setAttribute('aria-expanded', 'false');
      input.after(button);
      button.addEventListener('click', event => { event.preventDefault(); open(form, name, button); });
      input.parentElement.addEventListener('click', event => { if (event.target === button || event.target === input || modal.open) return; event.preventDefault(); open(form, name, button); });
      input.addEventListener('invalid', event => { event.preventDefault(); if (!modal.open) open(form, name, button); });
      input.addEventListener('input', () => sync(form)); input.addEventListener('change', () => sync(form));
    }
    form.addEventListener('reset', () => queueMicrotask(() => sync(form)));
    sync(form);
  }
  window.FESDates = { enhance };
})();
