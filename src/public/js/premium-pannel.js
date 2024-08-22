const socket = io()
const userEmail = document.querySelector('#userEmail')
const userRole = document.querySelector('#userRole')
const premiumProductForm = document.querySelector('#premium_productForm')

socket.on("products", (data) => {
    renderProducts(data)
})

// Función para renderizar la tabla de productos
const renderProducts = (products) => {
    const tbody = document.querySelector("#productsTable tbody")
    tbody.innerHTML = ''

    // Obtener el email del usuario (asegúrate de que userEmail esté definido)
    const userEmail = document.getElementById("userEmail")

    // Se crean todas las filas de la tabla de una vez
    const rowsHTML = products
        .filter(product => product.owner === userEmail.textContent)
        .map(product => `
            <tr>
                <td data-label="Title">${product.title}</td>
                <td data-label="Description">${product.description}</td>
                <td data-label="Category">${product.category}</td>
                <td data-label="Price">${product.price}</td>
                <td data-label="Thumbnails">${product.thumbnails.length === 0 ? 'Empty' : product.thumbnails.join(', ')}</td>
                <td data-label="Code">${product.code}</td>
                <td data-label="Stock">${product.stock}</td>
                <td data-label="Status">${product.status}</td>
                <td data-label="Action"><button onclick="deleteProduct('${product._id}')" class="btn_deleteProduct">Delete</button></td>
            </tr>
        `).join('')

    // Se insertan las filas en el tbody
    tbody.innerHTML = rowsHTML
}

// Función para obtener los datos del formulario y enviarlo
const getProductData = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("status").getAttribute("data-value"),
        owner: userEmail.textContent
        // thumbnails: document.getElementById("thumbnails").value,
    }
    return product
}

// Función para eliminar un producto
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}

const sendForm = (e) => {
    e.preventDefault()
    socket.emit("addProduct", getProductData())
    // premiumProductForm.reset()
}

// Se envia el formulario
document.getElementById("premium_btn_submit").addEventListener("click", sendForm)

// Se traen los datos del array de inputs, para hacer cada input.
fetch('/jsons/productsForm-inputs.json')
    .then(response => response.json())
    .then(data => {
        const containerFormInputs = document.querySelector('.container_formInputs')
        containerFormInputs.innerHTML = ""

        data.forEach((input) => {
            const inputForm = document.createElement("div")
            inputForm.classList.add("productsForm_input_container_total")

            let content
            if (!input.dataValue) {
                content = `
                    <div class="productsForm_input_container">
                        <input class=${input.class.input} id=${input.id} type=${input.type} placeholder="" autoComplete="off">
                        <span class=${input.class.span}>${input.text}</span>
                    </div>`
            } else {
                content = `
                    <div class="container_formOptions">
                        <div class=${input.class} id=${input.id.one} data-value=${input.dataValue.one}>${input.text.one}</div>
                        <div class=${input.class} id=${input.id.two} data-value=${input.dataValue.two}>${input.text.two}</div>
                    </div>`
            }

            inputForm.innerHTML = content
            containerFormInputs.appendChild(inputForm)
            document.querySelectorAll(".statusOption").forEach(e => { e.addEventListener("click", selectStatus()) })
        })
    })
    .catch(error => console.error('Error fetching JSON:', error))

// Se le pasa el 'data-value' al id 'status' y agrega/elimina la clase 'active'
const selectStatus = () => {
    const statusElement = document.getElementById("status")

    document.querySelectorAll(".statusOption").forEach(element => {
        element.addEventListener("click", () => {
            const value = element.getAttribute('data-value')

            // Elimina la clase 'active' de todos los elementos
            document.querySelectorAll(".statusOption").forEach(el => {
                el.classList.remove("active")
            })

            // Agrega la clase 'active' al elemento clickeado
            element.classList.add("active")

            // Establece el 'data-value' al elemento con id 'status'
            statusElement.setAttribute("data-value", value)
        })
    })
}