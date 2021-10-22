const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const mongo = require("../modules/mongo");
const guildConfigSchema = require("../schemas/GuildConfigSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color")
    .setDescription("Set this guild's color."),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    await mongo().then(async (mongoose) => {
      try {
        const results = await guildConfigSchema.findOne({
          guildId,
        });

        const embed = new MessageEmbed()
          .setTitle("Guild Color")
          .setDescription(
            "Please select a color profile below or set your own with `/color set {HEX_CODE}`"
          )
          .setColor(results.guildColor);

        const row = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("colorprofile")
            .setPlaceholder("Please Choose a Color Profile")
            .addOptions([
              {
                label: "Default",
                description: "Set this guild's color to default (#d84343).",
                value: "#d84343",
              },
              {
                label: "Red",
                description: "Set this guild's color to red.",
                value: "#e23838",
              },
              {
                label: "Orange",
                description: "Set this guild's color to orange.",
                value: "#f78200",
              },
              {
                label: "Yellow",
                description: "Set this guild's color to yellow.",
                value: "#ffb900",
              },
              {
                label: "Green",
                description: "Set this guild's color to green.",
                value: "#5ebd3e",
              },
              {
                label: "Blue",
                description: "Set this guild's color to blue.",
                value: "#009cdf",
              },
              {
                label: "Purple",
                description: "Set this guild's color to purple.",
                value: "#973999",
              },
            ])
        );

        interaction.reply({ embeds: [embed], components: [row] });
      } finally {
        mongoose.connection.close();
      }
    });
  },
};
