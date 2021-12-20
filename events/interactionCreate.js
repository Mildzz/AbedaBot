const {MessageEmbed} = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db");
const a = require('indefinite');

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const client = interaction.client
    const guildId = interaction.guildId;

    const gColor = db
      .prepare(`SELECT guildColor FROM guilds WHERE guildId = '${guildId}'`)
      .pluck()
      .get();

    if (interaction.isSelectMenu()) {
      if (interaction.customId === "language") {
        const embed = new MessageEmbed()
          .setTitle("Guild Language")
          .setDescription(
            `You have set this guild's language to \`${interaction.values[0]}\``
          )
          .setColor(gColor);

        interaction.reply({embeds: [embed], components: []});

        db.exec(
          `UPDATE guilds SET language = '${interaction.values[0]}' WHERE guildId = '${guildId}'`
        );
      } else if (interaction.customId === "filter") {
        const embed = new MessageEmbed()
          .setTitle("Filter")
          .setDescription(
            `You have successfully created ${a(interaction.values[0])} filter.`
          )
          .setColor(gColor);

        interaction.reply({embeds: [embed], components: []});
      }
    }


    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName) || client.staffCommands.get(interaction.commandName) || client.adminCommands.get(interaction.commandName);

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
    }

    if (interaction.isButton()) {
      await interaction.deferUpdate()
    }
  },
};
