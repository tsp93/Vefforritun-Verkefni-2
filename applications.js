const express = require('express');

const { fetch, update, remove } = require('./db');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function showApplications(req, res) {
  const applications = await fetch();
  res.render('applications', { applications, title: 'Atvinnuumsóknir' });
}

async function processApplication(req, res) {
  const { id } = req.params;
  await update(id);
  return res.redirect('/applications');
}

async function deleteApplication(req, res) {
  const { id } = req.params;
  await remove(id);
  return res.redirect('/applications');
}


router.get('/applications', showApplications);
router.post('/applications/process/:id', catchErrors(processApplication));
router.post('/applications/delete/:id', catchErrors(deleteApplication));

module.exports = router;
