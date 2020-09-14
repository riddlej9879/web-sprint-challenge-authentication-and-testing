const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  await knex("users").insert([
    {
      username: "TestUser",
      password: await bcrypt.hash("TestPass", 14),
    },
  ]);
};
