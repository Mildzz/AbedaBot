const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Create a chat filter.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("guild")
        .setDescription("Create a guild-wide chat filter.")
        .addBooleanOption((option) =>
          option
            .setName("immunity")
            .setDescription("Should staff be immune to this filter?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Create a channel only filter.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel for this filter.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("immunity")
            .setDescription("Should staff be immune to this filter?")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(guildId);

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("filter")
        .setPlaceholder("Please Choose an Option.")
        .addOptions([
          {
            label: "Swear Filter",
            description: "Create a swear filter.",
            value: "swear",
          },
          {
            label: "Image Filter",
            description: "Create an image only filter.",
            value: "image",
          },
          {
            label: "Spam Filter",
            description: "Create a spam filter.",
            value: "spam",
          }
        ])
    );
    const embed = new MessageEmbed()
      .setTitle('Chat Filter')
      .setDescription('Please choose an option below.')
      .setColor(guildColor)
    interaction.reply({embeds: [embed], components: [row]});
  },
};
