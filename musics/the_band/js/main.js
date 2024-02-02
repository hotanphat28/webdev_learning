const buyButtons = document.querySelectorAll('.js-buy-ticket');
const modal = document.querySelector('.js-buy-tickets-modal');
const modalBox = document.querySelector('.js-buy-tickets-modal-box');
const close = document.querySelector('.js-buy-tickets-modal-cancel');

function showBuyTicketsModal() {
	modal.classList.add('open');
}

function closeBuyTicketsModal() {
	modal.classList.remove('open');
}

for (const buyButton of buyButtons) {
	buyButton.addEventListener('click', showBuyTicketsModal);
}

close.addEventListener('click', closeBuyTicketsModal);
modal.addEventListener('click', closeBuyTicketsModal);
modalBox.addEventListener('click', function (event) {
	event.stopPropagation();
});

const nav = document.querySelector('.js-nav');
const navBar = document.querySelector('.js-navBar');
const hamburger = document.querySelector('.hamburger');

hamburger.onclick = function () {
	const isClosed = navBar.clientHeight === 0;
	if (isClosed) {
		nav.classList.add('openNav');
	} else {
		nav.classList.remove('openNav');
	}
};

const navItems = document.querySelectorAll('nav ul li a[href*="#"]');
for (var i = 0; i < navItems.length; i++) {
	const navItem = navItems[i];
	const isParentNav = navItem.nextElementSibling && navItem.nextElementSibling.classList.contains('js-subNav');
	navItem.onclick = function () {
		if (!isParentNav) {
			nav.classList.remove('openNav');
		}
	};
}
