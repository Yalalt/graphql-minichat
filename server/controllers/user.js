import knex from "../lib/db.js";

export async function getUser(username) {
  return await knex.table("user").first().where({ username });
}
