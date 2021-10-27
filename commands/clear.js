const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specified amount of messages.")
    .addIntegerOption((option) =>
      option
        .setName("messages")
        .setDescription("Amount of messages to delete.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const amount = interaction.options.getInteger("messages");
    const errorEmbed = new MessageEmbed()
      .setTitle("An error has occured")
      .setColor(0xd84343);

    if (amount > 100 || amount < 2) {
      errorEmbed.setDescription(
        "Please enter an amount of messages between 1 & 100."
      );
      interaction.reply({ embeds: [errorEmbed] });
    } else {
      interaction.channel
        .bulkDelete(amount, true)
        .then((messages) =>
          interaction.reply({
            content: `Cleared ${messages.size} messages.`,
            ephemeral: true,
          })
        )
        .catch((e) => {
          errorEmbed.setDescription(`\`\`\`${e}\`\`\``);
          interaction.reply({ embeds: [errorEmbed] });
        });
    }
  },
};
