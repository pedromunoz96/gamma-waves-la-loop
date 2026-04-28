document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.shopify-section-header .header');
    const body = document.body;
    const menuDrawer = document.querySelector('.menu-drawer-container');

    function checkHeaderTransparency() {
        const isMenuOpening = menuDrawer && menuDrawer.classList.contains('menu-opening');
        const shouldBeTransparent = body.classList.contains('template-index') &&
            window.scrollY === 0 &&
            !isMenuOpening;

        if (shouldBeTransparent) {
            header.classList.add('transparent');
        } else {
            header.classList.remove('transparent');
        }
    }

    checkHeaderTransparency();

    window.addEventListener('scroll', checkHeaderTransparency);

    if (menuDrawer) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkHeaderTransparency();
                }
            });
        });

        observer.observe(menuDrawer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});