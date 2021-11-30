const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specified amount of messages.")
    .setDefaultPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("messages")
        .setDescription("Amount of messages to delete.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const language = require(`../languages/${getGuildLanguage(interaction.guildId)}`)

    const amount = interaction.options.getInteger("messages");
    const errorEmbed = new MessageEmbed()
      .setTitle(language.error)
      .setColor(0xd84343);

    if (amount > 100 || amount < 2) {
      errorEmbed.setDescription(
        language.clearError
      );
      interaction.reply({embeds: [errorEmbed]});
    } else {
      interaction.channel
        .bulkDelete(amount, true)
        .then((messages) =>
          interaction.reply({
            content: `${language.cleared} ${messages.size} ${language.messages}.`,
            ephemeral: true,
          })
        )
        .catch((e) => {
          errorEmbed.setDescription(`\`\`\`${e}\`\`\``);
          interaction.reply({embeds: [errorEmbed]});
        });
    }
    //}
  },
};
