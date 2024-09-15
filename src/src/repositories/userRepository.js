import UserManager from '../dao/db/user-manager-db.js';

class UserRepository {
    async createUser(userDTO) {
        return await UserManager.createUser(userDTO);
    }

    async getUsers() {
        return await UserManager.getUsers();
    }

    async getUserById(id) {
        return await UserManager.getUserById(id);
    }
    async getUserByUsername(username) {
        return await UserManager.findOne({ username });
    }
    async getUserByEmail(email) {
        return await UserManager.findOne({ email });
    }

    async getUserByCartId(cartId) {
        try {
            return await UserManager.findOne({ cart: cartId });
        } catch (error) {
            console.error("Error al obtener usuario por ID de carrito:", error);
            throw new Error("Error al obtener usuario por ID de carrito");
        }
    }
    async getCartByUserId(id) {
        return await UserManager.getCartByUserId(id);
    }

    async updateUser(id, userDTO) {
        return await UserManager.updateUser(id, userDTO);
    }

    async deleteUser(id) {
        return await UserManager.deleteUser(id);
    }
}

export default new UserRepository();
