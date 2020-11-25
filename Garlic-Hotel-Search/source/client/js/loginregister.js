function loginRegisterSwitch() {
  const register = document.getElementById("registerForm");
  const login = document.getElementById("loginForm");

  register.classList.toggle("registerForm-active");
  login.classList.toggle("loginForm-active");
}
