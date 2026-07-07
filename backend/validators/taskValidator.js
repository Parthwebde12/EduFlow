const { body, param } = require("express-validator");

const createValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("deadline")
        .notEmpty()
        .withMessage("Deadline is required"),

    body("priority")
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority")
];

const updateValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid task ID"),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),

    body("deadline")
        .optional(),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority"),

    body("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status")
];

const deleteValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid task ID")
];

module.exports = {
    createValidation,
    updateValidation,
    deleteValidation
};