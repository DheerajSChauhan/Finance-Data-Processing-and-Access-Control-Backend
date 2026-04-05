const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../../middleware/auth');
const rbac = require('../../middleware/rbac');
const validateRequest = require('../../middleware/validate');
const controller = require('./users.controller');

const router = express.Router();

router.use(auth, rbac('admin'));

router.get('/', controller.index);
router.get('/:id', [param('id').isUUID().withMessage('Valid user id is required')], validateRequest, controller.show);
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['admin', 'analyst', 'viewer']).withMessage('Role must be admin, analyst, or viewer'),
  ],
  validateRequest,
  controller.store
);
router.patch(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid user id is required'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('role').optional().isIn(['admin', 'analyst', 'viewer']).withMessage('Role must be admin, analyst, or viewer'),
    body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  ],
  validateRequest,
  controller.update
);
router.delete('/:id', [param('id').isUUID().withMessage('Valid user id is required')], validateRequest, controller.destroy);

module.exports = router;