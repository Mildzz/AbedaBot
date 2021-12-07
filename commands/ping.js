const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("test"),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(guildId);

    const embed = new MessageEmbed()
      .setTitle(language.ping)
      .setDescription(`${interaction.client.ws.ping}`)
      .setColor(guildColor);
    interaction.reply({ embeds: [embed] });
  },
};
