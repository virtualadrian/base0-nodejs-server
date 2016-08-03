// database.js

require('dotenv').config();  // loads key-values in .env file into process.env

// Select correct database config object for the current environment
var knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);
var bookshelf = require('bookshelf')(knex);

// Resolve circular dependencies with relations
bookshelf.plugin('registry');

module.exports = bookshelf;