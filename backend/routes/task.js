const express = require('express');
const { body, param } = require("express-validator")

export const createvalidation = [
    body("title").notEmpty().withMessage("title is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("deadline").notEmpty().withMessage("deadline is required"),
    body("priority").notEmpty().withMessage("priority is required"),
]
export const updatevalidation = [
    param("id").notEmpty().withMessage("id is required"),
    body("title").optional(),
    body("description").optional(),
    body("deadline").optional(),
    body("priority").optional(),
    body("status").optional(),
]
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.use(protect);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
module.exports = router;