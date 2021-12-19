require("dotenv").config();
const {MessageEmbed} = require('discord.js')
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const fs = require("fs");

module.exports = {
  name: "guildCreate",
  async execute(guild) {

    try {
      const Database = require("better-sqlite3");
      const db = new Database("guildconf.db");

      // noinspection SyntaxError
      const insert = db.prepare(
        "INSERT INTO guilds (guildId, guildColor, StaffRole, logChannelId, language) VALUES (@guildId, @guildColor, @StaffRole, @logChannelId, @language)"
      );

      // Set Command Permissions
      await db
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

    const rest = new REST({
      version: "9",
    }).setToken(process.env.TOKEN);

    const staffCommands = [];
    const commandFiles = fs
      .readdirSync(`./staffCommands/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../staffCommands/${file}`);
      staffCommands.push(command.data.toJSON());
    }

    const adminCommands = [];
    const adminCommandFiles = fs
      .readdirSync(`./adminCommands/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of adminCommandFiles) {
      const command = require(`../adminCommands/${file}`);
      adminCommands.push(command.data.toJSON());
    }

    const adminAndStaff = staffCommands.concat(adminCommands)

    if(guild.id === "921932115409522798") {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENTID,
          guild.id
        ),
        {body: adminAndStaff}
      );

      console.log(`\x1b[31m%s\x1b[0m`, `[STATUS]`, "Admin commands successfully registered.")
    } else {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENTID,
          guild.id
        ),
        {body: staffCommands}
      );
      console.log(`Added commands to ${guild.name}`)
    }

    const joinEmbed = new MessageEmbed()
      .setTitle('Guild Joined')
      .setDescription(`Joined "${guild.name}" with ${guild.members.cache.size} members.`)
      .setFooter(`Owner: ${guild.client.users.cache.get(guild.ownerId).tag} (${guild.ownerId})`, guild.iconURL())
      .setColor(0xd84343)

    guild.client.guilds.cache.get('886114589102714890')?.channels.cache.get('913578478899712030').send({embeds: [joinEmbed]})
  },
};