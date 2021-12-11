// noinspection SyntaxError

require("dotenv").config();
const fetch = require("node-fetch");
const cmds = require("../modules/cmds")
require("better-sqlite3");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await cmds(client)

    console.log(
      `\x1b[31m%s\x1b[0m`,
      `[STATUS]`,
      `Logged in as ${client.user.tag}`
    );

    function start() {
      setTimeout(function () {
        fetch("https://api.quotable.io/random")
          .then((response) => response.json())
          .then((data) => {
            client.user.setPresence({
              activities: [{
                name: `"${data.content}" - ${data.author}`
              }],
              status: "online",
              type: "playing",
            });
          });

        start();
      }, 7200000); // 2 hours
    }

    start();

    const Database = require("better-sqlite3");
    const db = new Database("guildconf.db");
    db.exec(
      `CREATE TABLE IF NOT EXISTS guilds (guildId varchar, guildColor varchar, StaffRole varchar, logChannelId varchar, language varchar)`
    );
    db.exec(
      `CREATE TABLE IF NOT EXISTS reactionRoles (guildId varchar, messageId varchar, channelId varchar, role varchar, emoji varchar)`
    );
    console.log(`\x1b[31m%s\x1b[0m`, `[STATUS]`, "Connected to SQLite");

  },
};
