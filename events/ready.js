// noinspection SyntaxError

require("dotenv").config();
const fetch = require("node-fetch");
const cmds = require("../modules/cmds");
const staffCmds = require('../modules/staffCmds')
const adminCmds = require('../modules/adminCommands')
require("better-sqlite3");
const fs = require("fs");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await cmds(client)
    await staffCmds(client)
    await adminCmds(client)

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
    db.exec(
      `CREATE TABLE IF NOT EXISTS stats (date varchar, guildId varchar, messageCount varchar)`
    );
    console.log(`\x1b[31m%s\x1b[0m`, `[STATUS]`, "Connected to SQLite");

    const commands = [];
    const commandFiles = fs
      .readdirSync(`./commands/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({
      version: "9",
    }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENTID),
      {body: commands}
    );

    console.log(`\x1b[31m%s\x1b[0m`, `[STATUS]`, "Global commands successfully registered.")

  },
};
