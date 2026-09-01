const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formMessage = document.getElementById("formMessage");
const togglePassword =
  document.getElementById("togglePassword");
const loginButton =
  document.getElementById("loginButton");


// Mostrar / ocultar contraseña
togglePassword.addEventListener("click", () => {
  const isPassword =
    passwordInput.type === "password";
  passwordInput.type =
    isPassword ? "text" : "password";
  togglePassword.textContent =
    isPassword ? "Ocultar" : "Mostrar";
  togglePassword.setAttribute(
    "aria-label",
    isPassword
      ? "Ocultar contraseña"
      : "Mostrar contraseña"
  );
});


// Limpiar errores
function clearErrors() {
  emailError.textContent = "";
  passwordError.textContent = "";
  formMessage.textContent = "";
  formMessage.className = "form-message";
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
}


// Validación
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  const email =
    emailInput.value.trim().toLowerCase();
  const password =
    passwordInput.value;
  let valid = true;


  // Validar correo
  if (!email) {
    emailError.textContent =
      "Ingresa tu correo electrónico.";
    emailInput.classList.add("input-error");
    valid = false;
  } else if (!emailInput.checkValidity()) {
    emailError.textContent =
      "Ingresa un correo electrónico válido.";
    emailInput.classList.add("input-error");
    valid = false;
  }


  // Validar contraseña
  if (!password) {
    passwordError.textContent =
      "Ingresa tu contraseña.";
    passwordInput.classList.add("input-error");
    valid = false;
  } else if (password.length < 6) {
    passwordError.textContent =
      "La contraseña debe tener mínimo 6 caracteres.";
    passwordInput.classList.add("input-error");
    valid = false;
  }
  if (!valid) {
    return;
  }


  // Estado de carga
  loginButton.disabled = true;
  loginButton.innerHTML =
    '<span>Verificando...</span><span class="loader"></span>';


  /*
    --------------------------------------------------
    LOGIN DE PRUEBA - FRONTEND
    --------------------------------------------------

    Mientras CampoDirecto no tenga backend, la validación
    se hace contra los usuarios que registro.js guarda en
    localStorage ("campoDirectoUsuarios").

    IMPORTANTE:
    Esto NO debe utilizarse como autenticación
    definitiva en producción. Cuando exista el backend
    (Flask), esta comparación de correo/contraseña debe
    hacerse en el servidor contra contraseñas hasheadas,
    nunca en el navegador.
  */

  setTimeout(() => {
    const usuarios =
      JSON.parse(
        localStorage.getItem("campoDirectoUsuarios")
      ) || [];

    const usuario =
      usuarios.find(
        (u) => u.email === email && u.password === password
      );

    if (!usuario) {
      loginButton.disabled = false;
      loginButton.innerHTML =
        '<span>Iniciar sesión</span><span class="button-arrow">→</span>';

      formMessage.className = "form-message error";
      formMessage.textContent =
        "Correo o contraseña incorrectos.";

      passwordInput.classList.add("input-error");
      return;
    }

    const session = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      loggedIn: true,
      loginDate:
        new Date().toISOString()
    };

    localStorage.setItem(
      "campoDirectoSesion",
      JSON.stringify(session)
    );


    formMessage.className =
      "form-message success";

    formMessage.textContent =
      `¡Bienvenido, ${usuario.name.split(" ")[0]}!`;


    loginButton.innerHTML =
      '<span>Sesión iniciada</span><span>✓</span>';


    /*
      Por ahora mostramos el éxito.
      Más adelante cambiaremos esto por:

      window.location.href =
      "dashboard.html";
    */
  }, 1000);

});


// Recuperar contraseña
document
  .getElementById("forgotPassword")
  .addEventListener("click", (event) => {

    event.preventDefault();

    alert(
      "La recuperación de contraseña estará disponible cuando conectemos el sistema de usuarios."
    );

  });


// Si ya existe una sesión
const existingSession =
  localStorage.getItem("campoDirectoSesion");

if (existingSession) {

  try {

    const session =
      JSON.parse(existingSession);

    if (session.loggedIn) {

      formMessage.className =
        "form-message info";

      formMessage.textContent =
        "Ya existe una sesión iniciada en este navegador.";

    }

  } catch (error) {

    localStorage.removeItem(
      "campoDirectoSesion"
    );

  }

}
