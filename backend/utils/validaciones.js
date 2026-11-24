(() => {
  "use strict";

  const Validaciones = {
    requerido(valor, campo = "Campo") {
      if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ""
      ) {
        throw new Error(`${campo} es obligatorio.`);
      }
      return true;
    },

    email(valor) {
      const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!expresion.test(String(valor).trim())) {
        throw new Error("El correo electrónico no es válido.");
      }

      return true;
    },

    password(valor) {
      if (typeof valor !== "string" || valor.length < 8) {
        throw new Error(
          "La contraseña debe tener al menos 8 caracteres."
        );
      }

      return true;
    },

    telefono(valor) {
      const limpio = String(valor).replace(/\s+/g, "");

      if (!/^[0-9+()-]{7,20}$/.test(limpio)) {
        throw new Error("El teléfono no es válido.");
      }

      return true;
    },

    numeroPositivo(valor, campo = "Valor") {
      const numero = Number(valor);

      if (!Number.isFinite(numero) || numero <= 0) {
        throw new Error(`${campo} debe ser mayor que cero.`);
      }

      return numero;
    },

    texto(valor, campo = "Campo", maximo = 500) {
      this.requerido(valor, campo);

      const limpio = String(valor).trim();

      if (limpio.length > maximo) {
        throw new Error(
          `${campo} no puede superar ${maximo} caracteres.`
        );
      }

      return limpio;
    },

    rol(valor) {
      if (!["productor", "comprador"].includes(valor)) {
        throw new Error("El tipo de cuenta no es válido.");
      }

      return valor;
    },

    estadoPedido(valor) {
      const estados = [
        "pendiente",
        "aceptado",
        "rechazado",
        "enviado",
        "entregado",
        "cancelado"
      ];

      if (!estados.includes(valor)) {
        throw new Error("El estado del pedido no es válido.");
      }

      return valor;
    },

    calificacion(valor) {
      const numero = Number(valor);

      if (!Number.isInteger(numero) || numero < 1 || numero > 5) {
        throw new Error("La calificación debe estar entre 1 y 5.");
      }

      return numero;
    }
  };

  window.CampoValidaciones = Validaciones;
})();