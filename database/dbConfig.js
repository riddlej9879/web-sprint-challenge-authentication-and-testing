const knex = require("knex");
const { testing } = require("../knexfile");
const knexfile = require("../knexfile.js");

const env = process.env.NODE_ENV;

module.exports = knex(knexfile[env]);
