// Update with your config settings.

require('dotenv').config();  // loads key-values in .env file into process.env

module.exports = {

/*
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },
*/
  
  development: {
    client: 'mysql',
    connection: {
/*      database: 'devdb_nodejs_test',
      user: 'dev_master',
      password: 'dev_password' */
      database: process.env.dev_database,
      user: process.env.dev_user,
      password: process.env.dev_password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },


  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
