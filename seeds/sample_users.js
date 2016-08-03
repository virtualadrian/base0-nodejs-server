
exports.seed = function(knex, Promise) {
  var bcrypt = require('bcrypt');
  //var saltRounds = 10;
  //var plainTextPassword = 'secret';
  //var bcrypted_password = bcrypt.hashSync(plainTextPassword, saltRounds);

  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
                        name: 'testuser1', 
                        first_name: 'user1', 
                        last_name: 'test', 
                        email: 'user1@eastgate.in',
                        password: bcrypt.hashSync('user1secret', 10),
                        confirmed: 1,
                        confirmation_code: '',
                        created_at: knex.fn.now()
                      }),

        knex('users').insert({
                        name: 'testuser2', 
                        first_name: 'user2', 
                        last_name: 'test', 
                        email: 'user2@eastgate.in',
                        password: bcrypt.hashSync('user2secret', 10),
                        confirmed: 1,
                        confirmation_code: '',
                        created_at: knex.fn.now()
                      }),

        knex('users').insert({
                        name: 'testuser3', 
                        first_name: 'user3', 
                        last_name: 'test', 
                        email: 'user3@eastgate.in',
                        password: bcrypt.hashSync('user3secret', 10),
                        confirmed: 1,
                        confirmation_code: '',
                        created_at: knex.fn.now()
                      })        

      ]);
    });
};
