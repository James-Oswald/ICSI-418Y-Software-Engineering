function hamburger() {
  const hamburger = document.getElementById("hamburger");
  const hamburgerTop = document.querySelector(".nav-hamburger-line-top");
  const hamburgerMid = document.querySelector(".nav-hamburger-line-mid");
  const hamburgerBtm = document.querySelector(".nav-hamburger-line-btm");
  const menu = document.getElementById("menu");
  const body = document.querySelector("body");

  // class toggles on click
  hamburger.classList.toggle("hamburger-active");
  hamburgerTop.classList.toggle("hamburger-top-active");
  hamburgerMid.classList.toggle("hamburger-mid-active");
  hamburgerBtm.classList.toggle("hamburger-btm-active");
  menu.classList.toggle("menu-active");
  body.classList.toggle("overflow-hidden");
}