// Login Page, Register Page, Reques Password Reset Page ,Reset Password Page
const bodyHtml = document.body
const pageName = document.title
const inputs = document.querySelectorAll('.input')
const inputErrors = document.querySelectorAll('.input_error')
const placeholders = document.querySelectorAll('.input_placeholder')
const showPasswordIcon = document.querySelector('#showPasswordIcon')
const errorImg = `<img src="../assets/images/png/ios-exclamation-mark-icon.png" alt="Exclamation Mark Icon">`

// General inputs
const emailInput = document.querySelector('#email')
const emailErrors = document.querySelector('#errors_email')
const passwordInput = document.querySelector('#password')
const passwordErrors = document.querySelector('#errors_password')

// Request Password Reset Page
const requestPasswordResetForm = document.getElementById('requestPasswordResetForm')
const captchaInput = document.getElementById('captchaInput')
const errorsCaptcha = document.querySelector('#errors_captcha')
const captchaCode = document.getElementById('captchaCode')
const newCaptchaBtn = document.getElementById('newCaptchaBtn')
const requestPasswordBtn = document.querySelector('#requestPassword_btn')

// Reset Password Page
const resetpasswordForm = document.querySelector('#resetpasswordForm')
const cancelResetPasswordBtn = document.querySelector('#resetpassword_cancel')
const otpInputs = document.querySelectorAll('.otp-input')
const hideInputToken = document.getElementById('hideInputToken')
const hideInputEmail = document.getElementById('hideInputEmail')
const tokenErrors = document.querySelector('#errors_token')
const newPasswordInput = document.querySelector('#newPassword')
const errorsNewPassword = document.querySelector('#errors_newPassword')
const showNewPasswordIcon = document.querySelector('#showNewPasswordIcon')
const confirmPasswordInput = document.querySelector('#confirmPassword')
const errorsConfirmPassword = document.querySelector('#errors_confirmPassword')
const showConfirmPasswordIcon = document.querySelector('#showConfirmPasswordIcon')

// Login Page
const loginForm = document.querySelector('#loginForm')

// Register Page
const registerForm = document.querySelector('#registerForm')
const inputUsername = document.querySelector('#username')
const errorsUsername = document.querySelector('#errors_username')
const inputFirstName = document.querySelector('#first_name')
const errorsFirstName = document.querySelector('#errors_first_name')
const inputLastName = document.querySelector('#last_name')
const errorsLastName = document.querySelector('#errors_last_name')
const inputAge = document.querySelector('#age')
const errorsAge = document.querySelector('#errors_age')

// Acciones para ambas páginas
if (pageName === 'Login' || pageName === 'Register') {
    bodyHtml.style.backgroundColor = 'var(--clr-white)'
    // Función para mostrar/ocultar la contraseña en el input
    let passwordVisible = false

    showPasswordIcon.addEventListener('click', () => {
        passwordVisible = !passwordVisible
        if (passwordVisible) {
            passwordInput.type = 'text'
            showPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 8.073 12.194 L 4.212 8.333 c -1.52 1.657 -2.096 3.317 -2.106 3.351 L 2 12 l 0.105 0.316 C 2.127 12.383 4.421 19 12.054 19 c 0.929 0 1.775 -0.102 2.552 -0.273 l -2.746 -2.746 a 3.987 3.987 0 0 1 -3.787 -3.787 Z M 12.054 5 c -1.855 0 -3.375 0.404 -4.642 0.998 L 3.707 2.293 L 2.293 3.707 l 18 18 l 1.414 -1.414 l -3.298 -3.298 c 2.638 -1.953 3.579 -4.637 3.593 -4.679 l 0.105 -0.316 l -0.105 -0.316 C 21.98 11.617 19.687 5 12.054 5 Z m 1.906 7.546 c 0.187 -0.677 0.028 -1.439 -0.492 -1.96 s -1.283 -0.679 -1.96 -0.492 L 10 8.586 A 3.955 3.955 0 0 1 12.054 8 c 2.206 0 4 1.794 4 4 a 3.94 3.94 0 0 1 -0.587 2.053 l -1.507 -1.507 Z" /></svg>'
        } else {
            passwordInput.type = 'password'
            showPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 12 5 c -7.633 0 -9.927 6.617 -9.948 6.684 L 1.946 12 l 0.105 0.316 C 2.073 12.383 4.367 19 12 19 s 9.927 -6.617 9.948 -6.684 l 0.106 -0.316 l -0.105 -0.316 C 21.927 11.617 19.633 5 12 5 Z m 0 11 c -2.206 0 -4 -1.794 -4 -4 s 1.794 -4 4 -4 s 4 1.794 4 4 s -1.794 4 -4 4 Z" /><path d="M 12 10 c -1.084 0 -2 0.916 -2 2 s 0.916 2 2 2 s 2 -0.916 2 -2 s -0.916 -2 -2 -2 Z" /></svg>'
        }
    })
}

// Función para manejar los estilos de error de un input específico
const handleInputsErrorStyle = (input, hasErrors) => {
    if (hasErrors) {
        input.classList.add('input-red')
        input.nextElementSibling.classList.add('placeholder-red')
        if (input.nextElementSibling.nextElementSibling) {
            input.nextElementSibling.nextElementSibling.classList.add('show_password_icon-red')
        }
    } else {
        input.classList.remove('input-red')
        input.nextElementSibling.classList.remove('placeholder-red')
        if (input.nextElementSibling.nextElementSibling) {
            input.nextElementSibling.nextElementSibling.classList.remove('show_password_icon-red')
        }
    }
}

// Función para manejar los estilos de error del input del token
const handleInputTokenErrorStyle = (hasErrors) => {
    otpInputs.forEach((input) => {
        hasErrors ? input.classList.add('input-red') : input.classList.remove('input-red')
    })
}

// -------------------- Request Reset Password Page --------------------

if (pageName === 'Recover your account') {
    // Función para generar un código alfanumérico de 6 caracteres
    function generateCaptchaCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let code = ''
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            code += characters.charAt(randomIndex)
        }
        return code
    }

    // Se Muestra el código de verificación generado en el elemento
    function displayCaptchaCode() {
        const code = generateCaptchaCode()
        captchaCode.innerText = code
    }
    displayCaptchaCode() // Se Genera un código de verificación al cargar la página

    // Se Maneja el evento de clic del botón "Generate New Code"
    newCaptchaBtn.addEventListener('click', displayCaptchaCode)

    requestPasswordResetForm.addEventListener('submit', () => { validateResetPasswordForm(event) })
}

async function validateResetPasswordForm(event) {
    // Se evita que el formulario se envíe automáticamente
    event.preventDefault()
    // Se coloca un objeto de requerimiento de inputs
    const inputsRequired = {
        email: `${errorImg} Email address is required`,
        captcha: `${errorImg} Captcha Code is required`
    }

    // Se coloca un objeto de errores de inputs
    const inputsError = {
        captcha: `${errorImg} Captcha Code is incorrect`
    }

    // Se valida si hay un campo vacío
    !emailInput.value.length > 0 ? (emailErrors.innerHTML = inputsRequired.email, handleInputsErrorStyle(emailInput, true)) : (emailErrors.innerText = "", handleInputsErrorStyle(emailInput, false))
    !captchaInput.value.length > 0 ? (errorsCaptcha.innerHTML = inputsRequired.captcha, handleInputsErrorStyle(captchaInput, true)) : (errorsCaptcha.innerText = "", handleInputsErrorStyle(captchaInput, false))

    // Se valida el campo del captcha
    if (captchaInput.value.length > 0) {
        if (captchaInput.value !== captchaCode.innerText) {
            errorsCaptcha.innerHTML = inputsError.captcha, handleInputsErrorStyle(captchaInput, true)
            displayCaptchaCode()
        } else {
            errorsCaptcha.innerText = "", handleInputsErrorStyle(captchaInput, false)
        }
    }

    // Se realiza la consulta para el campo del 'email'
    async function validateField(emailData) {
        try {
            if (!emailData) {
                return null
            }

            const response = await fetch('/api/users/requestpasswordreset-validate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailData }),
            })

            const result = await response.json()

            if (result.errors !== null && result.errors.email) {
                emailErrors.innerHTML = errorImg + result.errors.email
                handleInputsErrorStyle(emailInput, true)
            }

            return result.errors
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    try {
        const emailData = emailInput.value
        await validateField(emailData)
    } catch (error) {
        console.error('An error ocurred:', error)
    }

    // Si no hay errores, se envía el formulario. De lo contrario, no se envía
    if (emailErrors.innerHTML.length === 0 && errorsCaptcha.innerHTML.length === 0) {
        let userEmail = emailInput.value
        document.cookie = `email=${userEmail}; expires=${new Date(Date.now() + 3600000).toUTCString()}; path=/resetpassword`
        requestPasswordResetForm.submit()
    } else {
        return false
    }
}

// -------------------- Reset Password Page --------------------

if (pageName === 'Reset your password') {
    // Función para mostrar/ocultar la contraseña en el input
    let passwordVisible = false

    showNewPasswordIcon.addEventListener('click', () => {
        passwordVisible = !passwordVisible
        if (passwordVisible) {
            newPasswordInput.type = 'text'
            showNewPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 8.073 12.194 L 4.212 8.333 c -1.52 1.657 -2.096 3.317 -2.106 3.351 L 2 12 l 0.105 0.316 C 2.127 12.383 4.421 19 12.054 19 c 0.929 0 1.775 -0.102 2.552 -0.273 l -2.746 -2.746 a 3.987 3.987 0 0 1 -3.787 -3.787 Z M 12.054 5 c -1.855 0 -3.375 0.404 -4.642 0.998 L 3.707 2.293 L 2.293 3.707 l 18 18 l 1.414 -1.414 l -3.298 -3.298 c 2.638 -1.953 3.579 -4.637 3.593 -4.679 l 0.105 -0.316 l -0.105 -0.316 C 21.98 11.617 19.687 5 12.054 5 Z m 1.906 7.546 c 0.187 -0.677 0.028 -1.439 -0.492 -1.96 s -1.283 -0.679 -1.96 -0.492 L 10 8.586 A 3.955 3.955 0 0 1 12.054 8 c 2.206 0 4 1.794 4 4 a 3.94 3.94 0 0 1 -0.587 2.053 l -1.507 -1.507 Z" /></svg>'
        } else {
            newPasswordInput.type = 'password'
            showNewPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 12 5 c -7.633 0 -9.927 6.617 -9.948 6.684 L 1.946 12 l 0.105 0.316 C 2.073 12.383 4.367 19 12 19 s 9.927 -6.617 9.948 -6.684 l 0.106 -0.316 l -0.105 -0.316 C 21.927 11.617 19.633 5 12 5 Z m 0 11 c -2.206 0 -4 -1.794 -4 -4 s 1.794 -4 4 -4 s 4 1.794 4 4 s -1.794 4 -4 4 Z" /><path d="M 12 10 c -1.084 0 -2 0.916 -2 2 s 0.916 2 2 2 s 2 -0.916 2 -2 s -0.916 -2 -2 -2 Z" /></svg>'
        }
    })

    showConfirmPasswordIcon.addEventListener('click', () => {
        passwordVisible = !passwordVisible
        if (passwordVisible) {
            confirmPasswordInput.type = 'text'
            showConfirmPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 8.073 12.194 L 4.212 8.333 c -1.52 1.657 -2.096 3.317 -2.106 3.351 L 2 12 l 0.105 0.316 C 2.127 12.383 4.421 19 12.054 19 c 0.929 0 1.775 -0.102 2.552 -0.273 l -2.746 -2.746 a 3.987 3.987 0 0 1 -3.787 -3.787 Z M 12.054 5 c -1.855 0 -3.375 0.404 -4.642 0.998 L 3.707 2.293 L 2.293 3.707 l 18 18 l 1.414 -1.414 l -3.298 -3.298 c 2.638 -1.953 3.579 -4.637 3.593 -4.679 l 0.105 -0.316 l -0.105 -0.316 C 21.98 11.617 19.687 5 12.054 5 Z m 1.906 7.546 c 0.187 -0.677 0.028 -1.439 -0.492 -1.96 s -1.283 -0.679 -1.96 -0.492 L 10 8.586 A 3.955 3.955 0 0 1 12.054 8 c 2.206 0 4 1.794 4 4 a 3.94 3.94 0 0 1 -0.587 2.053 l -1.507 -1.507 Z" /></svg>'
        } else {
            confirmPasswordInput.type = 'password'
            showConfirmPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 12 5 c -7.633 0 -9.927 6.617 -9.948 6.684 L 1.946 12 l 0.105 0.316 C 2.073 12.383 4.367 19 12 19 s 9.927 -6.617 9.948 -6.684 l 0.106 -0.316 l -0.105 -0.316 C 21.927 11.617 19.633 5 12 5 Z m 0 11 c -2.206 0 -4 -1.794 -4 -4 s 1.794 -4 4 -4 s 4 1.794 4 4 s -1.794 4 -4 4 Z" /><path d="M 12 10 c -1.084 0 -2 0.916 -2 2 s 0.916 2 2 2 s 2 -0.916 2 -2 s -0.916 -2 -2 -2 Z" /></svg>'
        }
    })

    // Se obtienen todas las cookies
    const allCookies = document.cookie

    // Se busca la cookie específica ('email')
    const emailCookie = allCookies.split('; ').find(row => row.startsWith('email='))

    if (!emailCookie) {
        window.location.href = '/requestpasswordreset'
    }

    const emailValue = emailCookie.split('=')[1];

    const resetpasswordUserEmail = document.getElementById('resetpassword_userEmail')
    resetpasswordUserEmail.innerText = emailValue
    hideInputEmail.value = emailValue

    otpInputs.forEach(function (input, index) {
        input.addEventListener('input', function () {
            if (this.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus()
                }
            } else if (this.value.length === 0) {
                if (index > 0) {
                    otpInputs[index - 1].focus()
                }
            }
        })

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                if (index > 0) {
                    otpInputs[index - 1].focus()
                }
            }
        })
    })
    cancelResetPasswordBtn.addEventListener('click', () => {
        document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/resetpassword;' // Se limpia la cookie 'email'
    })
    resetpasswordForm.addEventListener('submit', () => { validateRequestPasswordResetForm(event) })
}

async function validateRequestPasswordResetForm(event) {
    event.preventDefault()
    const userCode = Array.from(otpInputs).map(input => input.value).join('')

    // Se coloca un objeto de requerimiento de inputs
    const inputsRequired = {
        token: `${errorImg} Token is required`,
        newPassword: `${errorImg} Enter a new password`,
        passwordConfirmation: `${errorImg} Password confirmation is required`
    }

    // Se coloca un objeto de errores de inputs
    const inputsError = {
        newPassword: `${errorImg} Password must be at least 8 characters long`,
        passwordConfirmation: `${errorImg} The passwords you entered do not match`
    }

    // Se valida si hay un campo vacío
    !userCode.trim() ? (tokenErrors.innerHTML = inputsRequired.token, handleInputTokenErrorStyle(true)) : (tokenErrors.innerText = "", handleInputTokenErrorStyle(false))
    !confirmPasswordInput.value.length > 0 ? (errorsConfirmPassword.innerHTML = inputsRequired.passwordConfirmation, handleInputsErrorStyle(confirmPasswordInput, true)) : (errorsConfirmPassword.innerText = "", handleInputsErrorStyle(confirmPasswordInput, false))

    // Se valida el campo y la longitud de la contraseña
    newPasswordInput.value.length > 0 ? (newPasswordInput.value.length < 8 ? (errorsNewPassword.innerHTML = inputsError.newPassword, handleInputsErrorStyle(newPasswordInput, true)) : (errorsNewPassword.innerHTML = '', handleInputsErrorStyle(newPasswordInput, false))) : (errorsNewPassword.innerHTML = inputsRequired.newPassword, handleInputsErrorStyle(newPasswordInput, true))

    // Se valida el campo y la confirmacion de la contraseña
    confirmPasswordInput.value.length > 0 ? (confirmPasswordInput.value !== newPasswordInput.value ? (errorsConfirmPassword.innerHTML = inputsError.passwordConfirmation, handleInputsErrorStyle(confirmPasswordInput, true)) : (errorsConfirmPassword.innerHTML = '', handleInputsErrorStyle(confirmPasswordInput, false))) : (errorsConfirmPassword.innerHTML = inputsRequired.passwordConfirmation, handleInputsErrorStyle(confirmPasswordInput, true))

    // Se realizan consultas al back para los campos 'email' y 'password'
    async function validateFields(tokenData, emailData, passwordData) {
        try {
            if (!tokenData || !emailData || !passwordData) {
                return null
            }

            const response = await fetch('/api/users/resetpassword-validate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: tokenData, email: emailData, password: passwordData }),
            })

            const result = await response.json()

            if (result.errors !== null && result.errors.token && result.errors.newPassword) {
                tokenErrors.innerHTML = errorImg + result.errors.token
                handleInputTokenErrorStyle(true)
                errorsNewPassword.innerHTML = errorImg + result.errors.newPassword
                handleInputsErrorStyle(newPasswordInput, true)
                return
            }
            if (result.errors !== null && result.errors.token) {
                tokenErrors.innerHTML = errorImg + result.errors.token
                handleInputTokenErrorStyle(true)
                return
            }
            if (result.errors !== null && result.errors.newPassword) {
                errorsNewPassword.innerHTML = errorImg + result.errors.newPassword
                handleInputsErrorStyle(newPasswordInput, true)
                return
            }

            return result.errors
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    try {
        const tokenData = userCode
        const emailData = hideInputEmail.value
        const passwordData = newPasswordInput.value
        await validateFields(tokenData, emailData, passwordData)
    } catch (error) {
        console.error('An error ocurred:', error)
    }

    hideInputToken.value = userCode // Pasadas las validaciones, se le pasa al input oculto, el dato del token

    // Si no hay errores, se envía el formulario. De lo contrario, no se envía
    if (tokenErrors.innerHTML.length === 0 && errorsNewPassword.innerHTML.length === 0 && errorsConfirmPassword.innerHTML.length === 0) {
        document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/resetpassword;' // Se limpia la cookie 'email'
        resetpasswordForm.submit()
    } else {
        return false
    }
}

// -------------------- Login Page --------------------

if (pageName === 'Login') {
    loginForm.addEventListener('submit', () => { validateLoginForm(event) })
}

async function validateLoginForm(event) {
    // Se evita que el formulario se envíe automáticamente
    event.preventDefault()

    // Se coloca un objeto de requerimiento de inputs
    const inputsRequired = {
        email: `${errorImg} Email address is required`,
        password: `${errorImg} Password is required`
    }

    // Se valida si hay un campo vacío
    !emailInput.value.length > 0 ? (emailErrors.innerHTML = inputsRequired.email, handleInputsErrorStyle(emailInput, true)) : (emailErrors.innerText = "", handleInputsErrorStyle(emailInput, false))
    !passwordInput.value.length > 0 ? (passwordErrors.innerHTML = inputsRequired.password, handleInputsErrorStyle(passwordInput, true)) : (passwordErrors.innerText = "", handleInputsErrorStyle(passwordInput, false))

    // Se realizan consultas al back para los campos 'email' y 'password'
    async function validateField(emailData, passwordData) {
        try {
            if (!emailData || !passwordData) {
                return null
            }

            const response = await fetch('/api/users/login-validate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailData, password: passwordData }),
            })

            const result = await response.json()

            if (result.errors !== null && result.errors.email) {
                emailErrors.innerHTML = errorImg + result.errors.email
                handleInputsErrorStyle(emailInput, true)
                passwordErrors.innerHTML = errorImg + result.errors.password
                handleInputsErrorStyle(passwordInput, true)
            }

            return result.errors
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    try {
        const emailData = emailInput.value
        const passwordData = passwordInput.value
        await validateField(emailData, passwordData)
    } catch (error) {
        console.error('An error ocurred:', error)
    }

    // Si no hay errores, se envía el formulario. De lo contrario, no se envía
    if (emailErrors.innerHTML.length === 0 && passwordErrors.innerHTML.length === 0) {
        loginForm.submit()
    } else {
        return false
    }
}

// -------------------- Register Page --------------------

if (pageName === 'Register') {
    registerForm.addEventListener('submit', () => { validateForm(event) })
}

async function validateForm(event) {
    // Se evita que el formulario se envíe automáticamente
    event.preventDefault()

    // Se define la expresión regular para validar que solo haya letras y espacios en el nombre y apellido
    const regexNameAndSurname = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/

    // Se coloca un objeto de requerimiento de inputs
    const inputsRequired = {
        username: `${errorImg} Username is required`,
        first_name: `${errorImg} First name is required`,
        last_name: `${errorImg} Last name is required`,
        email: `${errorImg} Email address is required`,
        password: `${errorImg} Password is required`,
        age: `${errorImg} Age is required`
    }

    // Se coloca un objeto de errores de inputs
    const inputsError = {
        first_name: `${errorImg} Not a valid first name`,
        last_name: `${errorImg} Not a valid last name`,
        password: `${errorImg} Password must be at least 8 characters long`,
        age: `${errorImg} You must be at least 18 years old to register`
    }

    // Se valida si hay un campo vacío
    !inputUsername.value.length > 0 ? (errorsUsername.innerHTML = inputsRequired.username, handleInputsErrorStyle(inputUsername, true)) : (errorsUsername.innerText = "", handleInputsErrorStyle(inputUsername, false))
    !emailInput.value.length > 0 ? (emailErrors.innerHTML = inputsRequired.email, handleInputsErrorStyle(emailInput, true)) : (emailErrors.innerText = "", handleInputsErrorStyle(emailInput, false))

    // Se valida el campo del nombre
    inputFirstName.value.length > 0 ? (!regexNameAndSurname.test(inputFirstName.value) ? (errorsFirstName.innerHTML = inputsError.first_name, handleInputsErrorStyle(inputFirstName, true)) : (errorsFirstName.innerHTML = '', handleInputsErrorStyle(inputFirstName, false))) : (errorsFirstName.innerHTML = inputsRequired.first_name, handleInputsErrorStyle(inputFirstName, true))

    // Se valida el campo del apellido
    inputLastName.value.length > 0 ? (!regexNameAndSurname.test(inputLastName.value) ? (errorsLastName.innerHTML = inputsError.last_name, handleInputsErrorStyle(inputLastName, true)) : (errorsLastName.innerHTML = '', handleInputsErrorStyle(inputLastName, false))) : (errorsLastName.innerHTML = inputsRequired.last_name, handleInputsErrorStyle(inputLastName, true))

    // Se valida la longitud de la contraseña
    passwordInput.value.length > 0 ? (passwordInput.value.length < 8 ? (passwordErrors.innerHTML = inputsError.password, handleInputsErrorStyle(passwordInput, true)) : (passwordErrors.innerHTML = '', handleInputsErrorStyle(passwordInput, false))) : (passwordErrors.innerHTML = inputsRequired.password, handleInputsErrorStyle(passwordInput, true))

    // Se valida la edad mínima
    inputAge.value.length > 0 ? (inputAge.value < 18 ? (errorsAge.innerHTML = inputsError.age, handleInputsErrorStyle(inputAge, true)) : (errorsAge.innerHTML = '', handleInputsErrorStyle(inputAge, false))) : (errorsAge.innerHTML = inputsRequired.age, handleInputsErrorStyle(inputAge, true))

    // Se realizan consultas al back para los campos 'username' y 'email'
    async function validateField(field, value, errorsElement, errorType, input) {
        try {
            if (!value) {
                return null
            }

            const response = await fetch('/api/users/register-validate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            })

            const result = await response.json()

            if (result.errors !== null && result.errors[errorType]) {
                errorsElement.innerHTML = errorImg + result.errors[errorType]
                handleInputsErrorStyle(input, true)
            }
            return result.errors
        } catch (error) {
            console.error(`Error fetching data for ${field}:`, error)
        }
    }

    try {
        await validateField("username", inputUsername.value, errorsUsername, "username", inputUsername)
        await validateField("email", emailInput.value, emailErrors, "email", emailInput)
    } catch (error) {
        console.error('An error ocurred:', error)
    }

    // Si no hay errores, se envía el formulario. De lo contrario, no se envía
    if (errorsUsername.innerHTML.length === 0 && errorsFirstName.innerHTML.length === 0 && errorsLastName.innerHTML.length === 0 && emailErrors.innerHTML.length === 0 && passwordErrors.innerHTML.length === 0 && errorsAge.innerHTML.length === 0) {
        registerForm.submit()
    } else {
        return false
    }
}