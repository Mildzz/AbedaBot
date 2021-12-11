// noinspection SyntaxError

const {MessageEmbed} = require('discord.js')

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

    require("dotenv").config();
    const {REST} = require("@discordjs/rest");
    const {Routes} = require("discord-api-types/v9");
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
      {body: commands}
    );

    console.log(`Added commands to ${guild.name}`)

    const joinEmbed = new MessageEmbed()
      .setTitle('Guild Joined')
      .setDescription(`Joined "${guild.name}" with ${guild.members.cache.size} members.`)
      .setFooter(`Owner: ${guild.client.users.cache.get(guild.ownerId).tag} (${guild.ownerId})`, guild.iconURL())
      .setColor(0xd84343)

    // guild.client.guilds.cache.get('886114589102714890').channels.cache.get('913578478899712030').send({embeds: [joinEmbed]})

  },
};