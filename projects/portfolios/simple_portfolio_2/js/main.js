function openRightMenu() {
	const navbarList = document.querySelector('.navbar__list');
	const hamburger = document.querySelector('.hamburger');

	navbarList.classList.toggle('showNav');
	hamburger.classList.toggle('toggle');
}
