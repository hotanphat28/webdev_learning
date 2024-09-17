const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav__links');
const links = document.querySelectorAll('.nav__links__item');

hamburger.addEventListener('click', () => {
	navLinks.classList.toggle('open');
	links.forEach((link) => {
		link.classList.toggle('fade');
	});
});
