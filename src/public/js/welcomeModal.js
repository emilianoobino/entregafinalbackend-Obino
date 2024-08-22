// Se traen los elementos del DOM
const welcomeModal = document.querySelector('.welcomeModal_container_total')
const welcomeModalCloseBtn = document.querySelector('.welcomeModal_btn')

// Si el usuario navega a '/products', el modal aparece
if (window.location.pathname === "/products" || window.location.pathname === "/realtimeproducts") {
    // Se Agrega una pequeña demora para que la animación se ejecute tiempo despues de cargar la página
    setTimeout(() => {
        welcomeModal.classList.add('showed')
    }, 100)
}

// Si apretamos el botón 'X' se cierra el modal
welcomeModalCloseBtn.addEventListener('click', () => {
    welcomeModal.classList.remove('showed')
})