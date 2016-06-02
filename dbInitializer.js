const db = require('./api/config').db;
const knex = require('knex')({
    client: db.client,
    connection: db.connection
});

knex.schema
    .createTable('ApiUsers', (table) => {
        table.increments('id').primary();
        table.string('api_id').unique().notNullable();
        table.string('key').notNullable();
        table.string('email').notNullable();
        table.string('phone');
        table.string('name').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        table.engine('InnoDB');
    })
    .createTable('ApiOrders', (table) => {
        table.increments('transaction_id').primary();
        table.string('api_id').notNullable().references('api_id').inTable('ApiUsers').onDelete('CASCADE').onUpdate('CASCADE');
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        table.engine('InnoDB');
    })
    .createTable('ApiOrderItems', (table) => {
        table.increments('id').primary();
        table.integer('transaction_id').unsigned().notNullable().references('transaction_id').inTable('ApiOrders').onDelete('CASCADE').onUpdate('CASCADE');
        table.string('name').notNullable();
        table.float('price').notNullable();
        table.integer('quantity').notNullable();
        table.engine('InnoDB');
    })
    .createTable('TokenBlackList', (table) => {
        table.increments('id').primary();
        table.string('jti').unique().notNullable();
        table.dateTime('expires').notNullable();
        table.engine('InnoDB');
    })
    .then((results) => {
        console.log('success...');
        knex.destroy();
    })
    .catch((e) => {
        console.log(e);
    });
