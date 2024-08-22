// Se traen los elementos del DOM
const socket = io()
const chatSection = document.getElementById("chat_section")
const userLogin = document.getElementById('userLogin').innerText
const chatBox = document.getElementById("chatBox")
let user = userLogin

// Se crea una funcion para enviar el mensaje
const sendMessage = () => {
    if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user: userLogin, message: chatBox.value })
        chatBox.value = ""
    }
}

// Si hay un evento de 'enter' en el input, se ejecuta la función para enviar el mensaje
chatBox.addEventListener("keyup", (event) => { if (event.key === "Enter") { sendMessage() } })

// Listener de Mensajes
socket.on("message", data => {
    let chat = document.getElementById("chat")
    let messages = ""
    let lastUser = ""
    let lastString = "last"
    let separator = ""
    let chatRoomDiv = `
    <div class="chat_title">
        <h4><span>To:</span> Community Chat</h4>
        <span id="logOut_btn">Log Out</span>
    </div>
    `

    data.forEach(message => {
        separator = ""
        if (lastUser === message.user) {
            messages = messages.substring(0, messages.lastIndexOf(lastString)) + messages.substring(messages.lastIndexOf(lastString) + lastString.length)
        } else if ((lastUser === "")) {
            separator = ""
        } else if (lastUser !== message.user) {
            separator = '<div class="separator"></div>'
        }
        if (lastUser !== message.user) {
            if (message.user === user) {
                messages = messages + `
                <div class="mine messages">
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            } else {
                messages = messages + separator + `
                <div class="yours messages">
                    <span>${message.user}</span>
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            }
        } else {
            if (message.user === user) {
                messages = messages + `
                <div class="mine messages">
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            } else {
                messages = messages + separator + `
                <div class="yours messages">
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            }
        }
        lastUser = message.user
    })
    chat.innerHTML = chatRoomDiv + messages
})