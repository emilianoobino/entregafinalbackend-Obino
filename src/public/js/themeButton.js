// Se traen los elementos del DOM
const lightModeBtn = document.querySelectorAll('#themeChanger_light')
const darkModeBtn = document.querySelectorAll('#themeChanger_dark')
const autoModeBtn = document.querySelectorAll('#themeChanger_auto')

// Se obtiene el estado actual del 'theme' desde el localStorage
const currentTheme = localStorage.getItem('theme') || 'auto'
setTheme(currentTheme)

// Se asignan manejadores de eventos
lightModeBtn.forEach((e) => { e.addEventListener('click', () => setTheme('light')) })
darkModeBtn.forEach((e) => { e.addEventListener('click', () => setTheme('dark')) })
autoModeBtn.forEach((e) => { e.addEventListener('click', () => setTheme('auto')) })

// Función para crear los 'themes'
function setTheme(theme) {
    // Guardar el 'theme' actual en el localStorage
    localStorage.setItem('theme', theme)

    // Aplicar el 'theme'
    if (theme === 'auto') {
        // Configurar el tema automáticamente según las preferencias del sistema/navegador
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light')
        autoModeBtn.forEach((e) => { e.classList.add('selected') })
        lightModeBtn.forEach((e) => { e.classList.remove('selected') })
        darkModeBtn.forEach((e) => { e.classList.remove('selected') })
    } else {
        document.documentElement.setAttribute('data-theme', theme)
        autoModeBtn.forEach((e) => { e.classList.remove('selected') })
        lightModeBtn.forEach((e) => { e.classList.toggle('selected', theme === 'light') })
        darkModeBtn.forEach((e) => { e.classList.toggle('selected', theme === 'dark') })
    }
}