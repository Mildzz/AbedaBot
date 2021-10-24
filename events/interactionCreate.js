const { MessageEmbed } = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db", { verbose: console.log });

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    // if (!interaction.isCommand() | !interaction.isSelectMenu()) return;

    if (interaction.customId === "colorprofile") {
      const embed = new MessageEmbed()
        .setTitle("Color Profile")
        .setDescription(
          `You have set this guild's color profile to \`${interaction.values[0]}\``
        )
        .setColor(interaction.values[0]);

      interaction.reply({ embeds: [embed], components: [] });

      db.exec(
        `UPDATE guilds SET guildColor = '${interaction.values[0]}' WHERE guildId = '${guildId}'`
      );
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
