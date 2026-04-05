const express = require('express');
const { body, param, query } = require('express-validator');
const auth = require('../../middleware/auth');
const rbac = require('../../middleware/rbac');
const validateRequest = require('../../middleware/validate');
const controller = require('./transactions.controller');

const router = express.Router();

router.use(auth);

router.get(
  '/',
  [
    query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    query('category').optional().isString().trim(),
    query('from').optional().isISO8601().toDate().withMessage('from must be a valid date'),
    query('to').optional().isISO8601().toDate().withMessage('to must be a valid date'),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  validateRequest,
  controller.index
);

router.get('/:id', [param('id').isUUID().withMessage('Valid transaction id is required')], validateRequest, controller.show);

router.post(
  '/',
  rbac('admin'),
  [
    body('user_id').optional().isUUID().withMessage('user_id must be a valid UUID'),
    body('amount').isFloat({ gt: 0 }).withMessage('amount must be a positive number').toFloat(),
    body('type').isIn(['income', 'expense']).withMessage('type must be income or expense'),
    body('category').trim().notEmpty().withMessage('category is required').isLength({ max: 100 }),
    body('date').isISO8601().toDate().withMessage('date must be a valid date'),
    body('notes').optional().isString(),
  ],
  validateRequest,
  controller.store
);

router.patch(
  '/:id',
  rbac('admin'),
  [
    param('id').isUUID().withMessage('Valid transaction id is required'),
    body('user_id').optional().isUUID().withMessage('user_id must be a valid UUID'),
    body('amount').optional().isFloat({ gt: 0 }).withMessage('amount must be a positive number').toFloat(),
    body('type').optional().isIn(['income', 'expense']).withMessage('type must be income or expense'),
    body('category').optional().trim().notEmpty().withMessage('category cannot be empty').isLength({ max: 100 }),
    body('date').optional().isISO8601().toDate().withMessage('date must be a valid date'),
    body('notes').optional().isString(),
  ],
  validateRequest,
  controller.update
);

router.delete('/:id', rbac('admin'), [param('id').isUUID().withMessage('Valid transaction id is required')], validateRequest, controller.destroy);

module.exports = router;