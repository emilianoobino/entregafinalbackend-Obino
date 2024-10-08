import UserRepository from '../repositories/user.repository.js';

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    // Listar todos los usuarios
    async getAllUsers(filter = {}, options = {}) {
        try {
            const result = await this.userRepository.find();
            return result;
        } catch (error) {
            throw new Error('Error al obtener los usuarios');
        }
    }

    // Obtener un usuario por su ID
    async getUserById(uid) {
        try {
            const result = await this.userRepository.findById(uid);
            return result;
        } catch (error) {
            throw new Error('Error al obtener el usuario por id');
        }
    }

    // Obtener un usario por su Email
    async getUserByEmail(email) {
        try {
            const result = await this.userRepository.findByEmail(email);
            return result;
        } catch (error) {
            throw new Error('Error al obtener el usuario por email');
        }
    }

    // Eliminar un usuario por su ID
    async deleteUserById(id) {
        try {
            const deletedUser = await this.userRepository.deleteById(id);
            if (!deletedUser) {
                throw new Error('Usuario no encontrado');
            }
            return deletedUser;
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }

    // Modificar un usuario por su ID
    async updateUserById(id, updateData) {
        try {
            const updatedUser = await this.userRepository.updateById(id, updateData);
            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    }
}

export default UserService;