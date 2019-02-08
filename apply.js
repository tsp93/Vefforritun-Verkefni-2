const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const { insert } = require('./db')

const router = express.Router();

const formValidation = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt'),

  check('email')
    .isEmail()
    .withMessage('Netfang verður að vera netfang'),

  check('phone')
    .matches(/^[0-9]{3}-?[0-9]{4}$/)
    .withMessage('Símanúmer verður að vera sjö tölustafir'),

  check('intro')
    .isLength({ min: 100})
    .withMessage('Kynning verður að vera að minnsta kosti 100 stafir'),

  check('job')
    .isIn(['programmer', 'designer', 'leader'])
    .withMessage('Velja verður starf'),

  sanitize('name')
    .trim()
    .escape(),
  sanitize('email')
    .normalizeEmail(),
  sanitize('phone')
    .blacklist('-')
    .toInt(),
  sanitize('intro')
    .trim()
    .escape(),
];

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function list(req, res) {
  const title = 'Umsókn';

  res.render('apply', {
    title,
  });
}

router.get('/', catchErrors(list));

module.exports = router;
