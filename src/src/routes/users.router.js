import express from 'express';
import UsersController from '../controllers/users.controller.js';

const router = express.Router();

router.post('/', UsersController.createUser);
router.get('/', UsersController.getUsers);
router.get('/:id', UsersController.getUserById);
router.put('/:id', UsersController.updateUser);
router.delete('/:id', UsersController.deleteUser);

export default router;
