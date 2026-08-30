const registerForm =
  document.getElementById("registerForm");

const nameInput =
  document.getElementById("name");

const emailInput =
  document.getElementById("email");

const phoneInput =
  document.getElementById("phone");

const passwordInput =
  document.getElementById("password");

const confirmPasswordInput =
  document.getElementById("confirmPassword");

const registerButton =
  document.getElementById("registerButton");

const formMessage =
  document.getElementById("formMessage");


// Mostrar contraseña
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {

    if (passwordInput.type === "password") {

      passwordInput.type = "text";

      this.textContent = "Ocultar";

    } else {

      passwordInput.type = "password";

      this.textContent = "Mostrar";

    }

  });


function clearErrors() {

  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("roleError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("confirmError").textContent = "";

  formMessage.textContent = "";
  formMessage.className = "form-message";

  document.querySelectorAll("input").forEach(input => {
    input.classList.remove("input-error");
  });

}


registerForm.addEventListener("submit", function(event) {

  event.preventDefault();

  clearErrors();

  let valid = true;


  const name =
    nameInput.value.trim();

  const email =
    emailInput.value.trim().toLowerCase();

  const phone =
    phoneInput.value.trim();

  const password =
    passwordInput.value;

  const confirmPassword =
    confirmPasswordInput.value;

  const role =
    document.querySelector(
      'input[name="role"]:checked'
    );


  // Nombre
  if (name.length < 3) {

    document.getElementById("nameError").textContent =
      "Ingresa tu nombre completo.";

    nameInput.classList.add("input-error");

    valid = false;

  }


  // Correo
  if (!email) {

    document.getElementById("emailError").textContent =
      "Ingresa tu correo.";

    emailInput.classList.add("input-error");

    valid = false;

  } else if (!emailInput.checkValidity()) {

    document.getElementById("emailError").textContent =
      "Ingresa un correo válido.";

    emailInput.classList.add("input-error");

    valid = false;

  }


  // Teléfono
  if (phone.length < 7) {

    document.getElementById("phoneError").textContent =
      "Ingresa un número de teléfono válido.";

    phoneInput.classList.add("input-error");

    valid = false;

  }


  // Rol
  if (!role) {

    document.getElementById("roleError").textContent =
      "Selecciona el tipo de cuenta.";

    valid = false;

  }


  // Contraseña
  if (password.length < 6) {

    document.getElementById("passwordError").textContent =
      "La contraseña debe tener mínimo 6 caracteres.";

    passwordInput.classList.add("input-error");

    valid = false;

  }


  // Confirmación
  if (confirmPassword !== password) {

    document.getElementById("confirmError").textContent =
      "Las contraseñas no coinciden.";

    confirmPasswordInput.classList.add("input-error");

    valid = false;

  }


  if (!valid) {
    return;
  }


  /*
   * =============================================
   * COMPROBAR SI YA EXISTE EL CORREO
   * =============================================
   */

  const usuarios =
    JSON.parse(
      localStorage.getItem("campoDirectoUsuarios")
    ) || [];


  const usuarioExiste =
    usuarios.some(
      usuario => usuario.email === email
    );


  if (usuarioExiste) {

    formMessage.className =
      "form-message error";

    formMessage.textContent =
      "Ya existe una cuenta con este correo.";

    emailInput.classList.add("input-error");

    return;

  }


  /*
   * =============================================
   * CREAR USUARIO
   * =============================================
   */

  const nuevoUsuario = {

    id:
      Date.now(),

    name:
      name,

    email:
      email,

    phone:
      phone,

    role:
      role.value,

    password:
      password,

    createdAt:
      new Date().toISOString()

  };


  /*
   * Guardar usuario
   */

  usuarios.push(nuevoUsuario);

  localStorage.setItem(
    "campoDirectoUsuarios",
    JSON.stringify(usuarios)
  );


  /*
   * Estado de carga
   */

  registerButton.disabled = true;

  registerButton.innerHTML =
    "<span>Creando cuenta...</span>" +
    '<span class="loader"></span>';


  setTimeout(() => {

    formMessage.className =
      "form-message success";

    formMessage.textContent =
      "¡Cuenta creada correctamente!";


    registerButton.innerHTML =
      "<span>Cuenta creada ✓</span>";


    /*
     * Guardamos el usuario actual
     */

    localStorage.setItem(
      "campoDirectoUsuarioActual",
      JSON.stringify(nuevoUsuario)
    );


    /*
     * Después de 1.5 segundos,
     * enviamos al login.
     */

    setTimeout(() => {

      window.location.href =
        "login.html";

    }, 1500);

  }, 900);

});
