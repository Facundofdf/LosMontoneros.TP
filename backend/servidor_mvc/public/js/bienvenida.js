document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formBienvenida");
    const input = document.getElementById("nombreUsuario");

    form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = input.value.trim();

    if (nombre === "") {
        alert("Por favor, ingresá tu nombre.");
        return;
    }

    // Guardar en localStorage
    localStorage.setItem("nombreUsuario", nombre);

    // Redirigir a la siguiente pantalla
    window.location.href = "/productos"; // o la próxima vista que tengamos
    });
});
