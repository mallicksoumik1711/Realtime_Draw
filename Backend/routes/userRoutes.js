const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const {getAllUsers, getUser, updateUser, deleteUser, searchUsers} = require('../controllers/userController');

router.get('/search', authMiddleware, searchUsers); // Moved search route above the :id route to prevent conflicts
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;