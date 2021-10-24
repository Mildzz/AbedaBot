const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("test"),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const guildColor = getGuildColor(guildId);

    const embed = new MessageEmbed()
      .setTitle("Ping")
      .setDescription(`${client.ws.ping}`)
      .setColor(guildColor);
    interaction.reply({ embeds: [embed] });
  },
};
