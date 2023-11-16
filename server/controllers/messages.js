import knex from "../lib/db.js";
import { customAlphabet } from "nanoid";

const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export async function getMessages() {
  return await knex.table("message").select().orderBy("createdAt", "asc");
}

export async function createMessage(user, text) {
  const message = {
    id: customAlphabet(chars, 12)(),
    user,
    text,
    createdAt: new Date().toISOString(),
  };
  await knex.table("message").insert(message);
  return message;
}
