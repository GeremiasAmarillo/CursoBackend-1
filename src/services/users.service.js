import UserRepository from '../repositories/userRepository.js';
import CartRepository from '../repositories/cartRepository.js';
import UserDTO from '../dto/user.dto.js';
import { isValidPassword, createHash } from '../util/util.js';
import Cart from '../dao/models/cart.model.js';

class UserService {

    async createUser(userData) {
        const userDTO = new UserDTO(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.age,
            userData.username,
            userData.role,
        );
        const userToSave = {
            ...userDTO,
            password: createHash(userData.password)
        };
        return await UserRepository.createUser(userToSave);
    }

    async getUsers() {
        return await UserRepository.getUsers();
    }

    async getUserById(id) {
        return await UserRepository.getUserById(id);
    }

    async updateUser(id, userData) {
        const userDTO = new UserDTO(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.age,
            userData.username,
            userData.role
        );
        let userToUpdate = { ...userDTO };
        if (userData.password) {
            userToUpdate.password = createHash(userData.password);
        }
        return await UserRepository.updateUser(id, userToUpdate);
    }

    async deleteUser(id) {
        return await UserRepository.deleteUser(id);
    }
    async registerUser(userData) {
        const existingUser = await UserRepository.getUserByEmail(userData.email);

        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        const { cartDTO, _id } = await CartRepository.createCart();
        userData.cart = _id;

        userData.password = createHash(userData.password);

        return await UserRepository.createUser(userData);
    }

    async loginUser(usernameOrEmail, password) {
        let user;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(usernameOrEmail)) {
            user = await UserRepository.getUserByEmail(usernameOrEmail);
        } else {
            user = await UserRepository.getUserByUsername(usernameOrEmail);
        }

        if (!user || !isValidPassword(password, user)) {
            throw new Error("Credenciales incorrectas");
        }
        return user;
    }
    async getCartByUserId(userId) {
        return await UserRepository.getCartByUserId(userId);
    }
}

export default new UserService();
