// Este módulo exporta las funciones para manejar el tema.
// Es "agnóstico" de la UI, salvo por la función setTheme
// que amablemente actualiza el texto del botón si lo encuentra.

export function getPreferredTheme() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Aplica un tema a la aplicación.
 * Actualiza el <html> (data-theme), guarda en localStorage
 * y actualiza el texto de CUALQUIER botón con id="theme-toggle-btn".
 * @param {'dark' | 'light'} theme 
 */
export function setTheme(theme) {
  const root = document.documentElement;
  // 1. Aplicar el tema al <html>
  root.setAttribute("data-theme", theme);
  
  // 2. Guardar en localStorage
  localStorage.setItem("theme", theme);

  // 3. Actualizar el texto de CUALQUIER botón de tema visible
  // Usamos querySelectorAll para encontrar todos los botones (ej. uno en navbar, otro en welcome)
  const toggleButtons = document.querySelectorAll(".theme-toggle-btn"); 
  
  toggleButtons.forEach(btn => {
    if (theme === "dark") {
      btn.textContent = "Modo Claro";
    } else {
      btn.textContent = "Modo Oscuro";
    }
  });
}

/**
 * Cambia el tema actual al opuesto.
 */
export function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") || getPreferredTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

/**
 * Conecta un botón de tema específico para que al hacer clic, cambie el tema.
 * @param {HTMLElement} buttonElement - El elemento <button> a conectar.
 */
export function connectThemeButton(buttonElement) {
    if (!buttonElement) return;

    // 1. Asegurarnos que tenga el texto inicial correcto
    const currentTheme = getPreferredTheme();
    buttonElement.textContent = currentTheme === "dark" ? "Modo Claro" : "Modo Oscuro";
    
    // 2. Añadir el listener
    buttonElement.addEventListener("click", toggleTheme);

    // 3. Añadir la clase común para que setTheme() los encuentre
    buttonElement.classList.add("theme-toggle-btn");
}