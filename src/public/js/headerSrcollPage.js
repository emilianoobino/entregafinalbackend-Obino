// Se traen los elementos del DOM
const pageTitle = document.title
const headerPage = document.querySelector('.headerPage_container')
const headerPageButtons = document.querySelector('.headerPage_buttons')
const goUpbtn = document.getElementById("headerPage_goUpbtn")
const pixels = 80

// Se agrega el evento para que desplace 'smooth' hasta el header
goUpbtn.addEventListener("click", (event) => {
    event.preventDefault()
    // Desplazamiento suave hacia el formulario
    document.getElementById("header_global").scrollIntoView({ behavior: 'smooth' })
})

// Se agrega el evento para que aparezca el header del scroll
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    if (scrollY >= pixels) {
        headerPage.classList.add('showed')
    } else {
        headerPage.classList.remove('showed')
    }
})