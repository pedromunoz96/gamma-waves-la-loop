/**
 * Cart Upsell Carousel — adapted for la-lopp-theme
 *
 * - Variant select / radio: updates hidden [name=id] input + price display
 * - Custom carousel arrow controls + scroll-snap sync
 * - Re-init after cart updates (PUB_SUB_EVENTS.cartUpdate from pubsub.js)
 *   The cart-drawer fully re-renders .drawer__inner via renderContents(),
 *   so the upsell DOM is fresh on every update.
 * - Add-to-cart visual feedback (checkmark swap)
 *
 * Add-to-cart AJAX is handled by the theme's <product-form> element
 * (assets/product-form.js) — no extra wiring needed.
 */
(function () {
  /* ---- Variant select (dropdown) ---- */
  document.addEventListener('change', function (e) {
    var select = e.target.closest && e.target.closest('[data-upsell-variant-select]');
    if (!select) return;
    var card = select.closest('.mp-cart-upsell__card');
    if (!card) return;

    var selectedOption = select.options[select.selectedIndex];
    var variantInput = card.querySelector('input[name="id"]');
    var priceDisplay = card.querySelector('[data-upsell-price-display]');

    if (variantInput) variantInput.value = select.value;
    if (priceDisplay && selectedOption) priceDisplay.textContent = selectedOption.dataset.price;

    var btnPrice = card.querySelector('[data-upsell-btn-price]');
    if (btnPrice && selectedOption) btnPrice.textContent = selectedOption.dataset.price;
  });

  /* ---- Variant radio buttons ---- */
  document.addEventListener('change', function (e) {
    var radio = e.target.closest && e.target.closest('[data-upsell-variant-radio]');
    if (!radio) return;
    var card = radio.closest('.mp-cart-upsell__card');
    if (!card) return;

    var variantInput = card.querySelector('input[name="id"]');
    var priceDisplay = card.querySelector('[data-upsell-price-display]');

    if (variantInput) variantInput.value = radio.value;
    if (priceDisplay) priceDisplay.textContent = radio.dataset.price;

    var btnPrice = card.querySelector('[data-upsell-btn-price]');
    if (btnPrice) btnPrice.textContent = radio.dataset.price;
  });

  /* ---- Carousel arrows + scroll sync ---- */
  function getTrack(root) {
    return root.querySelector('[data-mp-cart-upsell-track]');
  }

  function syncArrows(root) {
    var track = getTrack(root);
    if (!track) return;
    var prev = root.querySelector('[data-mp-cart-upsell-prev]');
    var next = root.querySelector('[data-mp-cart-upsell-next]');
    if (!prev && !next) return;

    var slides = track.querySelectorAll('.mp-cart-upsell__slide');
    if (slides.length <= 1) {
      if (prev) prev.disabled = true;
      if (next) next.disabled = true;
      return;
    }

    var atStart = track.scrollLeft <= 5;
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd;
  }

  function slideStep(track) {
    var slide = track.querySelector('.mp-cart-upsell__slide');
    if (slide) return slide.getBoundingClientRect().width + 12;
    return track.clientWidth * 0.9;
  }

  /* ---- Mouse drag-to-scroll ----
     Lets the user grab the track and drag it horizontally with the mouse.
     Touch devices keep their native scroll + momentum, so this is mouse-only.

     Uses classic mouse events (not Pointer Events) on purpose: preventDefault()
     on `mousedown` is what reliably kills the browser's native text-selection
     and image/link drag. A native image/link drag would otherwise fire
     `pointercancel` and silently abort the gesture — which is exactly why a
     real mouse felt broken while a trackpad (native two-finger scroll) worked.
     A drag past DRAG_THRESHOLD swallows the trailing click so the product
     link / add-to-cart button doesn't fire at the end of a drag gesture. */
  function initDrag(root, track) {
    var DRAG_THRESHOLD = 5;
    var isDown = false;
    var moved = false;
    var startX = 0;
    var startScroll = 0;

    function onMouseMove(e) {
      if (!isDown) return;
      /* Button released outside the window — no mouseup will arrive. */
      if (e.buttons === 0) {
        endDrag();
        return;
      }
      var dx = e.clientX - startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) moved = true;
      track.scrollLeft = startScroll - dx;
    }

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('mp-cart-upsell__track--dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', endDrag);
      syncArrows(root);
    }

    track.addEventListener('mousedown', function (e) {
      /* Primary button only; let the native <select> open on its own. */
      if (e.button !== 0 || (e.target.closest && e.target.closest('select, option'))) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('mp-cart-upsell__track--dragging');
      /* Kills text selection + native image/link drag for this gesture.
         Does NOT block the trailing `click`, so taps still work. */
      e.preventDefault();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', endDrag);
    });

    /* Swallow the click that trails a drag (capture phase, before links/buttons). */
    track.addEventListener(
      'click',
      function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true
    );
  }

  function initRoot(root) {
    if (root.dataset.mpInit === '1') return;
    root.dataset.mpInit = '1';

    var track = getTrack(root);
    if (!track) return;

    var prev = root.querySelector('[data-mp-cart-upsell-prev]');
    var next = root.querySelector('[data-mp-cart-upsell-next]');

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -slideStep(track), behavior: 'smooth' });
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: slideStep(track), behavior: 'smooth' });
      });
    }
    track.addEventListener('scroll', function () { syncArrows(root); }, { passive: true });
    initDrag(root, track);
    syncArrows(root);
  }

  function initAll() {
    var roots = document.querySelectorAll('[data-mp-cart-upsell]');
    for (var i = 0; i < roots.length; i++) initRoot(roots[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* ---- Re-init after cart updates ----
     cart-drawer.js renderContents() replaces .drawer__inner's innerHTML, so the
     upsell DOM is fresh and the previous mp-init flag is gone — re-running
     initAll() wires up the new nodes. */
  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.cartUpdate, function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(initAll);
      });
    });
  }

  /* ---- Add-to-cart visual feedback ---- */
  document.addEventListener(
    'submit',
    function (e) {
      var card = e.target.closest && e.target.closest('.mp-cart-upsell__card');
      if (!card) return;
      var btn = card.querySelector('.mp-cart-upsell__add-btn');
      if (!btn || btn.dataset.added === 'true') return;
      btn.dataset.added = 'true';
      setTimeout(function () {
        if (btn.isConnected) btn.dataset.added = 'false';
      }, 2000);
    },
    true
  );
})();
