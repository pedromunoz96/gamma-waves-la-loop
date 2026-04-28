;(function () {
	const header = () => {
		const body = document.querySelector('body')
		const openBtn = document.querySelector('.header__offcanvas-toggle')
		const closeBtn = document.querySelector(
			'.header__offcanvas-toggle-link--close'
		)
		const offMenu = document.querySelector('.header__offcanvas-menu')
		const searchDetails = document.querySelector('.header__details')
		const submenuDetails = document.querySelectorAll(
			'.header__submenu li details'
		)

		const headerHiddenMenu = document.querySelector('.header__inline-menu')
		const openSearchBtn = document.querySelector('.header__search')

		const openMenu = (e) => {
			e.preventDefault()
			offMenu.classList.remove('header__offcanvas-menu--close')
			offMenu.classList.add('header__offcanvas-menu--open')
			openBtn.classList.add('active')
			body.classList.add('body--hidden')
			closeBtn.style.display = 'block'
			openBtn.style.display = 'none'
			// Always hide inline menu when offcanvas is opened
			headerHiddenMenu.style.display = 'none'
			
			// Ensure offcanvas is visible when opened
			const offcanvasElement = document.querySelector('.header__offcanvas')
			if (offcanvasElement) {
				offcanvasElement.style.visibility = 'visible'
			}
		}

		const closeMenu = () => {
			offMenu.classList.remove('header__offcanvas-menu--open')
			offMenu.classList.add('header__offcanvas-menu--close')
			openBtn.classList.remove('active')
			body.classList.remove('body--hidden')
			body.classList.remove('overflow-hidden-tablet')
			closeBtn.style.display = 'none'
			openBtn.style.display = 'block'
			
			// Only show inline menu on desktop (min-width: 1100px)
			if (window.innerWidth >= 1100) {
				headerHiddenMenu.style.display = 'block'
			} else {
				headerHiddenMenu.style.display = 'none'
			}
			
			// Restore offcanvas visibility based on screen size
			const offcanvasElement = document.querySelector('.header__offcanvas')
			if (offcanvasElement) {
				if (window.innerWidth >= 1100) {
					offcanvasElement.style.visibility = 'visible'
				} else {
					offcanvasElement.style.visibility = 'hidden'
				}
			}
			
			document
				.querySelector('.header')
				.classList.remove('search-header--opened')
		}

		openBtn && openBtn.addEventListener('click', openMenu)
		closeBtn &&
			closeBtn.addEventListener('click', function (e) {
				e.preventDefault()
				closeMenu()
			})

		// Add resize event listener to handle responsive behavior
		window.addEventListener('resize', () => {
			const offcanvasElement = document.querySelector('.header__offcanvas')
			
			if (window.innerWidth >= 1100) {
				// On desktop, show inline menu if offcanvas is not active
				if (!openBtn.classList.contains('active')) {
					headerHiddenMenu.style.display = 'block'
				}
				// Show offcanvas menu on desktop
				if (offcanvasElement) {
					offcanvasElement.style.visibility = 'visible'
				}
				// Remove body--hidden class on desktop to allow scrolling
				body.classList.remove('body--hidden')
				body.classList.remove('overflow-hidden-tablet')
				
				// If offcanvas menu is open on desktop, close it properly
				if (openBtn.classList.contains('active')) {
					closeMenu()
				}
			} else {
				// On mobile, hide inline menu
				headerHiddenMenu.style.display = 'none'
				// Hide offcanvas menu on mobile
				if (offcanvasElement) {
					offcanvasElement.style.visibility = 'hidden'
				}
				// If offcanvas menu is active on mobile, keep body--hidden
				if (openBtn.classList.contains('active')) {
					body.classList.add('body--hidden')
				}
			}
		})

		submenuDetails.forEach((targetDetail) => {
			targetDetail.addEventListener('click', () => {
				submenuDetails.forEach((detail) => {
					if (detail !== targetDetail) {
						detail.removeAttribute('open')
						document
							.querySelector('.header')
							.classList.remove('search-header--opened')
					}
				})
			})
		})

		document.addEventListener('keyup', (e) => {
			if (e.key === 'Escape') {
				closeMenu()
				searchDetails.removeAttribute('open')
				body.classList.remove('overflow-hidden')
				body.classList.remove('search-overflow-hidden')
				document
					.querySelector('.header')
					.classList.remove('search-header--opened')

				//document
				//	.querySelector(".header__icons")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__inline-menu")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__offcanvas")
				//	.classList.remove("hide-header-line");
			}
		})

		openSearchBtn.addEventListener('click', () => {
			if (searchDetails.open) {
				body.classList.add('overflow-hidden')
				body.classList.add('search-overflow-hidden')
				document.querySelector('.header').classList.add('search-header--opened')

				//document
				//	.querySelector(".header__icons")
				//	.classList.add("hide-header-line");
				//document
				//	.querySelector(".header__inline-menu")
				//	.classList.add("hide-header-line");
				//document.querySelector(
				//	".header__search .modal-close-button"
				//).style.display = "block";
				//document
				//	.querySelector(".header__offcanvas")
				//	.classList.add("hide-header-line");
			} else {
				body.classList.remove('overflow-hidden')
				body.classList.remove('search-overflow-hidden')
				document
					.querySelector('.header')
					.classList.remove('search-header--opened')

				// Restore offcanvas visibility based on screen size
				const offcanvasElement = document.querySelector('.header__offcanvas')
				if (offcanvasElement) {
					if (window.innerWidth >= 1100) {
						offcanvasElement.style.visibility = 'visible'
					} else {
						offcanvasElement.style.visibility = 'hidden'
					}
				}

				// Restore inline menu visibility based on screen size
				if (window.innerWidth >= 1100) {
					headerHiddenMenu.style.display = 'block'
				} else {
					headerHiddenMenu.style.display = 'none'
				}

				//document
				//	.querySelector(".header__icons")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__inline-menu")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__offcanvas")
				//	.classList.remove("hide-header-line");
			}
		})

		let headerOverlayAlways = document.querySelector('.overlay')

		$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				headerOverlayAlways && $('.header').addClass('header_overlay-scroll')
			} else {
				headerOverlayAlways && $('.header').removeClass('header_overlay-scroll')
			}
		})

		const initMegaSubmenuWithTabs = () => {
			const megaMenus = document.querySelectorAll('.mega-submenu-with-tabs')

			function setupSizing(menu) {
				const tabsList = menu.querySelector(
					'.mega-submenu-with-tabs__tabs-list'
				)
				const tabs = Array.from(
					menu.querySelectorAll('.mega-submenu-with-tabs__tab')
				)

				if (!tabsList || tabs.length === 0) return

				let maxH = 0

				tabs.forEach((tab) => {
					const prevVis = tab.style.visibility
					const prevPos = tab.style.position
					tab.style.visibility = 'hidden'
					tab.style.position = 'static'

					maxH = Math.max(maxH, tab.offsetHeight)

					tab.style.visibility = prevVis
					tab.style.position = prevPos
				})

				const cs = window.getComputedStyle(tabsList)
				const capH = parseFloat(cs.maxHeight)

				tabsList.style.height = Math.min(maxH, capH) + 'px'
			}

			megaMenus.forEach((menu) => {
				const childItems = Array.from(
					menu.querySelectorAll('.mega-submenu-with-tabs__child-item')
				)
				const tabs = Array.from(
					menu.querySelectorAll('.mega-submenu-with-tabs__tab')
				)

				const clearActive = () => {
					childItems.forEach((ci) => ci.classList.remove('active'))
					tabs.forEach((tab) => tab.classList.remove('active'))
				}

				childItems.forEach((item) => {
					item.addEventListener('mouseenter', () => {
						clearActive()
						item.classList.add('active')

						const tabId = item.id
						const match = menu.querySelector(
							`.mega-submenu-with-tabs__tab[data-menu-tab-id="${tabId}"]`
						)

						if (match) match.classList.add('active')
					})
				})

				setupSizing(menu)
			})

			function setupPoisition(menu) {
				menu.style.left = '0'

				const menuRight = menu.getBoundingClientRect().right

				if (menuRight >= document.body.clientWidth) {
					menu.style.left = `${document.body.clientWidth - menuRight - 20}px`
				}
			}

			function setupMenus() {
				megaMenus.forEach((menu) => {
					setupPoisition(menu)
				})
			}

			setupMenus()

			const headerEl = document.querySelector('.shopify-section-header')
			let headerElWidth = headerEl.offsetWidth

			const resizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.contentRect.width != headerElWidth) {
						setupMenus()
						headerElWidth = entry.contentRect.width
					}
				})
			})

			resizeObserver.observe(headerEl)
		}

		initMegaSubmenuWithTabs()
		
		// Initialize header state based on screen size
		const initializeHeaderState = () => {
			const offcanvasElement = document.querySelector('.header__offcanvas')
			
			if (window.innerWidth >= 1100) {
				// On desktop, show inline menu and offcanvas
				headerHiddenMenu.style.display = 'block'
				if (offcanvasElement) {
					offcanvasElement.style.visibility = 'visible'
				}
			} else {
				// On mobile, hide inline menu and offcanvas
				headerHiddenMenu.style.display = 'none'
				if (offcanvasElement) {
					offcanvasElement.style.visibility = 'hidden'
				}
			}
		}
		
		// Initialize on page load
		initializeHeaderState()
	}

	document
		.querySelector('.search-modal-close-button')
		.addEventListener('click', function () {
			document
				.querySelector('.header')
				.classList.remove('search-header--opened')
			document.querySelector('.header__details').removeAttribute('open')
			document
				.querySelector('.header')
				.classList.remove('search-header--opened')
		})

	let searchTabs = document.querySelectorAll('.predictive-search__result-tab')
	let results = document.querySelectorAll('.search__items-list')

	if (results.length != 0) {
		results[0].classList.add('active')
		searchTabs[0].classList.add('active')
	}
	searchTabs.forEach((tab) => {
		tab.addEventListener('click', (event) => {
			event.preventDefault()
			let typeTarget = tab.dataset.typeTarget

			searchTabs.forEach((element) => {
				element.classList.remove('active')
			})
			tab.classList.add('active')

			results.forEach((element) => {
				let resultsType = element.dataset.type
				if (resultsType == typeTarget) {
					element.classList.add('active')
				} else {
					element.classList.remove('active')
				}
			})
		})
	})

	const announcementBar = document.querySelector('.announcement-bar')
	const headerOffcanvas = document.querySelector('.header__offcanvas-wrapper')

	announcementBar &&
		headerOffcanvas &&
		headerOffcanvas.classList.add('announcement-bar-show')

	$(window).scroll(function () {
		if ($(window).scrollTop() > 100) {
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.add('announcement-bar-hide')
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.remove('announcement-bar-show')
		} else {
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.remove('announcement-bar-hide')
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.add('announcement-bar-show')
		}
	})

	document.addEventListener('shopify:section:load', header)

	header()
})()

//button-with-underline
if (window.screen.width > 990) {
	let attachedHeader = false

	let headerSection = document.querySelector('.shopify-section-header')

	let imageContainerHeader = headerSection.querySelector(
		'.button--with-underline--container'
	)

	const followMouseHeader = (event) => {
		if (imageContainerHeader) {
			imageContainerHeader.style.left = event.pageX + 'px'
			let mouseEvent =
				event.pageY - window.scrollY - headerSection.offsetHeight + 30
			imageContainerHeader.style.top = mouseEvent + 'px'
		}
	}

	function showTextHeader() {
		if (!attachedHeader && imageContainerHeader) {
			attachedHeader = true
			imageContainerHeader.style.display = 'block'
			document.addEventListener('pointermove', followMouseHeader)
		}
	}

	function hideTextHeader() {
		if (imageContainerHeader) {
			attachedHeader = false
			imageContainerHeader.style.display = ''
			document.removeEventListener('pointermove', followMouseHeader)
		}
	}
}
