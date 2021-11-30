// noinspection JSClosureCompilerSyntax

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    try {
      const Database = require("better-sqlite3");
      const db = new Database("guildconf.db");

      const insert = db.prepare(
        "INSERT INTO guilds (guildId, guildColor, StaffRole, logChannelId, language) VALUES (@guildId, @guildColor, @StaffRole, @logChannelId, @language)"
      );

      // Set Command Permissions

      const staffRole = await db
          .prepare(
              `SELECT StaffRole FROM guilds WHERE guildId = '${guild.id}'`
          )
          .pluck()
          .get();

      insert.run({
        guildId: guild.id,
        guildColor: "#d84343",
        StaffRole: null,
        logChannelId: null,
        language: "en-US",
      });

      console.log(`Bot has joined \`${guild.name}\`. Uploading commands...`);
    } catch (e) {
      console.log(e);
    }

    /*** Let's get messy ***/

    require("dotenv").config();
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    const fs = require("fs");

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
      Routes.applicationGuildCommands(
        process.env.CLIENTID,
        guild.id
      ),
      { body: commands }
    );

    console.log(`Added commands to ${guild.name}`)

  },
};
// How do I get an interaction's commandId from another file