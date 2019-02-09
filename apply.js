const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const { insert } = require('./db');

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
    .matches(/^[0-9]{3}(-| )?[0-9]{4}$/)
    .withMessage('Símanúmer verður að vera sjö tölustafir'),

  check('text')
    .isLength({ min: 100 })
    .withMessage('Kynning verður að vera að minnsta kosti 100 stafir'),

  check('job')
    .isIn(['Forritari', 'Hönnuður', 'Verkefnastjóri'])
    .withMessage('Velja verður starf'),

  sanitize('name')
    .trim()
    .escape(),
  sanitize('email')
    .normalizeEmail(),
  sanitize('phone')
    .blacklist('-')
    .toInt(),
  sanitize('text')
    .trim()
    .escape(),
];

function form(req, res) {
  const data = {};
  res.render('apply', {
    data, title: 'Atvinnuumsókn', errors: [], missing: [],
  });
}

async function formPost(req, res) {
  const {
    body: {
      name, email, phone, text, job,
    } = {},
  } = req;

  const data = {
    name: xss(name),
    email: xss(email),
    phone: xss(phone),
    text: xss(text),
    job: xss(job),
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    const missing = [];
    errors.forEach((error) => {
      missing.push(error.param);
    });
    return res.render('apply', {
      data, title: 'Atvinnuumsókn', errors, missing,
    });
  }

  await insert(data);

  data={};
  return res.redirect('/thanks');
}

function thanks(req, res) {
  return res.render('thanks', { title: 'Takk fyrir' });
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/', form);
router.post('/', formValidation, catchErrors(formPost));
router.get('/thanks', thanks);

module.exports = router;
