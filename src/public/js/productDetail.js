function addProductToCart() {
    const btn = document.querySelector('.itemDetail_add_to_bag')
    const btnAdd = document.querySelector('#addToCartInitial')

    btnAdd.disabled = true // Se deshabilita el botón

    // Se obtienen los datos del botón
    const cart = btn.getAttribute('data-cart')
    const product = btn.getAttribute('data-product')

    fetch(`/api/carts/${cart}/product/${product}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud')
        }
        return response.json()
    })
    .then(data => {
        window.location.href = `/carts/${cart}`
    })
    .catch(error => {
        console.error('Error:', error)
    })
}

// Se cambia el boton en base al producto y al usuario
function changeButton(){
    const addToCartInitial= document.getElementById("addToCartInitial")
    const dataownerproduct = addToCartInitial.getAttribute("data-ownerProduct")
    const datauseremail = addToCartInitial.getAttribute("data-userEmail")
    if(dataownerproduct == datauseremail){
        addToCartInitial.textContent= "You're the owner of this product"
        addToCartInitial.style.color='grey'
        addToCartInitial.style.pointerEvents='none'
        addToCartInitial.removeAttribute("data-ownerProduct")
        addToCartInitial.removeAttribute("data-userEmail")
        addToCartInitial.removeAttribute("data-cart")
        addToCartInitial.removeAttribute("data-product")
        addToCartInitial.removeAttribute('onclick')
    }else{
        addToCartInitial.textContent= "Add to Bag"
        addToCartInitial.removeAttribute("data-ownerProduct")
        addToCartInitial.removeAttribute("data-userEmail")
        addToCartInitial.className = "itemDetail_add_to_bag"
    }
}
changeButton()