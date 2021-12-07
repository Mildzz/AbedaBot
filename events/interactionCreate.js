const {MessageEmbed} = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db");

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
          .setTitle("Color Profile")
          .setDescription(
            `You have set this guild's language to \`${interaction.values[0]}\``
          )
          .setColor(gColor);

        interaction.reply({embeds: [embed], components: []});

        db.exec(
          `UPDATE guilds SET language = '${interaction.values[0]}' WHERE guildId = '${guildId}'`
        );
      }
    }

    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
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
