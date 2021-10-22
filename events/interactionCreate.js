const { MessageEmbed } = require("discord.js");
const guildConfigSchema = require("../schemas/GuildConfigSchema");
const mongo = require("../modules/mongo");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    // if (!interaction.isCommand()) return;

    if (interaction.customId === "colorprofile") {
      const embed = new MessageEmbed()
        .setTitle("Color Profile")
        .setDescription(
          `You have set this guild's color profile to \`${interaction.values[0]}\``
        )
        .setColor(interaction.values[0]);

      interaction.reply({ embeds: [embed], components: [] });

      await mongo().then(async (mongoose) => {
        try {
          await guildConfigSchema.findOneAndUpdate(
            {
              guildId,
            },
            {
              guildId,
              guildColor: interaction.values[0],
            },
            {
              upsert: true,
            }
          );
        } finally {
          mongoose.connection.close();
        }
      });
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
