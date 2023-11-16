import knexObject from "knex";

const knex = knexObject({
  client: "better-sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "./data/mydb.sqlite",
  },
});

knex.on("query", ({ sql, bindings }) => {
  console.log("[Query] ", knex.raw(sql, bindings).toQuery());
});

export default knex;
