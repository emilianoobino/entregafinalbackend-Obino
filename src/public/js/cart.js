const cartNotification = document.querySelector('#cartNotif')
const cartNotifText = document.querySelector('#cartNotif_text')
const cartNotifBtn = document.querySelector('#cartNotif_btn')
const cartProductList = document.querySelector('#cartProductList')
const section_cart_full = document.querySelector('.section_cart_full')
const section_cart_empty = document.querySelector('.section_cart_empty')

// Función para cerrar la notificación del carrito
const closeNotif = () => {
    cartNotification.classList.remove('active')
}

function updateHeaderAndPrice() {
    const card = document.querySelectorAll(".cart_product")
    let quantityheader = 0
    card.forEach(function (element, index) {
        const quantity = element.querySelector('.cart_product_text_span').textContent
        quantityheader = quantityheader + Number(quantity)
    })
    document.getElementById(`header_icons_bag_notification`).textContent = quantityheader
    const precios = document.querySelectorAll(".cart_product_text_price")
    let preciototal = 0
    for (let y = 0; y < precios.length; y++) {
        preciototal = preciototal + Number(precios[y].textContent.split("$")[1])
    }
    document.querySelector(`#totalPurchase`).textContent = "$" + preciototal
    document.querySelector(`#subTotalPurchase`).textContent = "$" + preciototal
    const iconBagNotification = document.querySelector('.header_icons_bag_notification')
    Number(iconBagNotification.textContent) > 0 ? iconBagNotification.classList.add('active') : iconBagNotification.classList.remove('active')
}

function deleteProductInCart(cartId, productId, productTitle) {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting the product from the cart.')
            }
        })
        .then(data => {
            // Se elimina el producto del DOM
            const productElement = document.getElementById(`product-${productId}`)
            if (productElement) {
                productElement.remove()
            }

            // Crear un observador de intersección para detectar cuando el header_global es visible
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Se mostrar la notificación
                        cartNotifText.textContent = `${productTitle} was removed from your bag. Any associated offers have also been removed.`
                        cartNotification.classList.add('active')

                        observer.unobserve(entry.target) // Se dejar de observar el elemento una vez que se ha activado la notificación
                    }
                })
            }, { threshold: 0.5 })

            const headerElement = document.getElementById("header_global")
            observer.observe(headerElement)

            headerElement.scrollIntoView({ behavior: 'smooth' }) // Se desplaza suavemente hacia arriba

            // Se comprueba si el carrito está vacío
            if (cartProductList.children.length === 0) {
                section_cart_full.style.display = 'none' // Se oculta la sección del carrito con productos
                section_cart_empty.style.display = 'flex' // Se muestra el mensaje de carrito vacío
            }
            updateHeaderAndPrice()
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function clearCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error emptying the cart.')
            }
        })
        .then(data => {
            section_cart_full.style.display = 'none' // Se oculta la sección del carrito con productos
            section_cart_empty.style.display = 'flex' // Se muestra el mensaje de carrito vacío

            document.getElementById("header_global").scrollIntoView({ behavior: 'smooth' }) // Se desplaza suave hacia arriba

            // Se muestra la notificación
            cartNotifText.textContent = `All products were removed from your bag. Any associated offers have also been removed.`
            setTimeout(() => { cartNotification.classList.add('active') }, 200)

            document.querySelector('.header_icons_bag_notification').classList.remove('active') // se quitan las cantidades del icono del cart
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function addOne(product, price, cart, stock) {
    const spanquantity = document.querySelector(`#quantity-${product}`).textContent
    const spanquantityMobile = document.querySelector(`#mobile-quantity-${product}`).textContent
    if ((Number(spanquantity) + 1) > 1 || (Number(spanquantityMobile) + 1) > 1) {
        document.querySelector(`#less-quantity-${product}`).disabled = false
    }
    if (Number(spanquantity) + 1 == stock || Number(spanquantityMobile) + 1 == stock) {
        document.querySelector(`#more-quantity-${product}`).disabled = true
    } if (Number(spanquantity) < stock || Number(spanquantityMobile) < stock) {
        document.querySelector(`#quantity-${product}`).textContent = Number(spanquantity) + 1
        document.querySelector(`#cartProductPrice-${product}`).textContent = "$" + (Number(spanquantity) + 1) * price
        document.querySelector(`#mobile-quantity-${product}`).textContent = Number(spanquantityMobile) + 1
        document.querySelector(`#mobile-cartProductPrice-${product}`).textContent = "$" + (Number(spanquantityMobile) + 1) * price
        updateHeaderAndPrice()
        fetch(`/api/carts/${cart}/product/${product}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantitySpeed: (Number(spanquantity) + 1) })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud')
                }
                return response.json()
            })
            .then(data => { })
            .catch(error => {
                console.error('Error:', error) // Manejo de errores
            })
    }
}

function removeOne(product, price, cart, stock, quantity) {
    const spanquantity = document.getElementById(`quantity-${product}`).textContent
    const spanquantityMobile = document.querySelector(`#mobile-quantity-${product}`).textContent
    if ((Number(spanquantity) - 1) < stock || (Number(spanquantityMobile) - 1) < stock) {
        document.getElementById(`more-quantity-${product}`).disabled = false
    }
    if ((Number(spanquantity) - 1) == 1 || (Number(spanquantityMobile) - 1) == 1) {
        document.getElementById(`less-quantity-${product}`).disabled = true
    } if (spanquantity > 1 || spanquantityMobile > 1) {
        document.getElementById(`quantity-${product}`).textContent = Number(spanquantity) - 1
        document.getElementById(`cartProductPrice-${product}`).textContent = "$" + (Number(spanquantity) - 1) * price
        document.getElementById(`mobile-quantity-${product}`).textContent = Number(spanquantity) - 1
        document.getElementById(`mobile-cartProductPrice-${product}`).textContent = "$" + (Number(spanquantity) - 1) * price
        updateHeaderAndPrice()
        fetch(`/api/carts/${cart}/product/${product}/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantitySpeed: (Number(spanquantity) - 1) })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud')
                }
                return response.json()
            })
            .then(data => { })
            .catch(error => {
                console.error('Error:', error) // Manejo de errores
            })
    }
}
