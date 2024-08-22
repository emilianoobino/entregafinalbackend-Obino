import express from 'express'
import upload from '../middleware/multer.js'

const router = express.Router()

export default (userController) => {
    // Ruta GET /api/users - Desde el administrador, se traen todos los usuarios
    router.get('/', userController.getAllUsers)

    // Ruta DELETE /api/users - Desde el administrador, se eliminan los usuarios inactivos
    router.delete('/', userController.deleteInactiveUsers)

    // Ruta DELETE /api/users/:uid - Desde el administrador, se elimina un usuario particular
    router.delete('/:uid', userController.deleteUser)

    // Ruta POST /api/users/register-validate - Validación de registro
    router.post('/register-validate', userController.register_validate)

    // Ruta POST /api/users/register - Registro de usuario
    router.post('/register', userController.register)

    // Ruta POST /api/users/login-validate - Validación de inicio de sesión
    router.post('/login-validate', userController.login_validate)

    // Ruta POST /api/users/login - Inicio de sesión
    router.post('/login', userController.login)

    // Ruta GET /api/users/logout - Cierra la sesión
    router.get('/logout', userController.logout)

    // Ruta POST /api/users/requestpasswordreset-validate - Validación para solicitar el reseteo de contraseña
    router.post('/requestpasswordreset-validate', userController.requestPasswordReset_validate)

    // Ruta POST /api/users/requestpasswordreset - Solicitud de cambio de contraseña
    router.post('/requestpasswordreset', userController.requestPasswordReset)

    // Ruta POST /api/users/resetpassword-validate - Validación para el nuevo cambio de contraseña
    router.post('/resetpassword-validate', userController.passwordReset_validate)

    // Ruta POST /api/users/resetpassword - Cambio de contraseña
    router.post('/resetpassword', userController.resetPassword)

    // Ruta POST /api/users/:uid/documents - Subida de documentos por el usuario
    router.post('/:uid/documents', upload.fields([
        { name: 'document' }, 
        { name: 'products' }, 
        { name: 'profile' }
    ]), userController.uploadDocs)

    // Ruta POST /api/users/premium/:uid - Modifica el rol del usuario
    router.post('/premium/:uid', userController.changeUserRole)


    return router
}





