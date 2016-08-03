
exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('users');

	return knex.schema.createTable('users', function(table){
		table.increments().primary();
		table.string('name').notNull();
		table.string('first_name', 255);
		table.string('last_name', 255);
		table.string('email', 255).notNull();
		table.string('password', 60).notNull();
		table.integer('confirmed');
		table.string('confirmation_code');
		table.timestamp('created_at').nullable();
		table.timestamp('updated_at').nullable();
		table.timestamp('deleted_at').nullable();
		table.timestamp('restored_at').nullable();		
	});  
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users');
};
