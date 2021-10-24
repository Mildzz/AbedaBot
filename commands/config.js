const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db", { verbose: console.log });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure settings for your guild.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("logs")
        .setDescription("The log channel for your guild.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Your logs channel.")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const guildColor = getGuildColor(interaction.guildId);
    if (interaction.options.getSubcommand() === "logs") {
      const logChannel = interaction.options.getChannel("channel");
      const logChannelId = logChannel.toString().replace(/[^a-zA-Z0-9 ]/g, "");
      db.exec(
        `UPDATE guilds SET logChannelId = '${logChannelId}' WHERE guildId = '${guildId}'`
      );
      const embed = new MessageEmbed()
        .setTitle("Log Channel")
        .setDescription(
          `Your server's log channel has been set to ${logChannel}`
        )
        .setColor(guildColor);
      interaction.reply({ embeds: [embed] });
    }
  },
};
