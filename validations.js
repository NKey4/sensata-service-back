import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("verificationCode", "Неверный формат кода").isLength({ min: 4 }),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("fullName", "Укажите имя").optional().isLength({ min: 3 }),
  body("phoneNumber", "Укажите номер телефона")
    .optional()
    .isLength({ min: 11 }),
];

export const applicationCreateValidation = [
  body("companyName", "Введите название компании")
    .isLength({ min: 3 })
    .isString(),
  body("description", "Введите описание")
    .isLength({
      min: 10,
    })
    .isString(),
  body("tags", "Неверный формат тэгов").optional().isString(),
  body("address", "Неверный адрес").isLength({ min: 4 }).isString(),
  body("imageUrl", "Неверная ссылка на изображение").isString(),
];
