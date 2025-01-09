const studiosDb = require('../db/queries/studiosQueries');
const CustomNotFoundError = require('../errors/CustomNotFoundError');

async function studiosListGet(req, res) {
  const studios = await studiosDb.getAllStudios();
  res.render('studios', { studios });
}

module.exports = { studiosListGet };
