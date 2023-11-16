import knex from "./db.js";

const { schema } = knex;

await schema.dropTableIfExists("user");
await schema.dropTableIfExists("message");

await schema.createTable("user", (table) => {
  table.text("username").notNullable().primary();
  table.text("password").notNullable();
});

await schema.createTable("message", (table) => {
  table.text("id").notNullable().primary();
  table.text("user").notNullable();
  table.text("text").notNullable();
  table.text("createdAt").notNullable();
});

await knex.table("message").insert([
  {
    id: "m00000000001",
    user: "system",
    text: "GraphQL чатад тавтай морилно уу!",
    createdAt: "2023-09-12T11:00:00.000Z",
  },
]);

await knex.table("user").insert([
  {
    username: "mask",
    password: "mask123",
  },
  {
    username: "bezos",
    password: "bezos123",
  },
  {
    username: "gates",
    password: "gates123",
  },
]);

process.exit();
