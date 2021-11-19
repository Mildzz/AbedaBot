const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help for the bot or a specific command.")
    .addStringOption((option) =>
      option.setName("command").setDescription("The command to look up.")
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const guildColor = getGuildColor(guildId);
    const cmd = interaction.options.getString("command");

    if (!cmd) {
      const noCmdEmbed = new MessageEmbed()
        .setTitle("AbedaBot Help")
        .setDescription(
          "Need help for a specific command? Just use `/help {COMMAND}`."
        )
        .setColor(guildColor);

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Invite AbedaBot")
          .setStyle("LINK")
          .setURL(
            "https://discord.com/api/oauth2/authorize?client_id=899506459031785482&permissions=38050809959&scope=bot%20applications.commands"
          ),
        new MessageButton()
          .setLabel("Commands")
          .setStyle("LINK")
          .setURL("https://abeda.net/commands")
      );

      await interaction.reply({ embeds: [noCmdEmbed], components: [row] });
    } else {
      try {
        const command = client.commands.get(cmd.toLowerCase()).data;
        const options = [];
        command.options.forEach((e) => {
          options.push(capitalize(e.name));
        });
        console.log(command.name);
        const embed = new MessageEmbed()
          .setTitle("AbedaBot Help")
          .addFields(
            {
              name: "Name",
              value: `[${capitalize(command.name)}](https://abeda.net/command/${
                command.name
              })`,
              inline: true,
            },
            {
              name: "Description",
              value: `${command.description}`,
              inline: true,
            },
            { name: "Options", value: `${options}`, inline: true },
            { name: "Default Permission", value: `idk let me fix this later`, inline: true }
          )
          .setColor(guildColor);
        interaction.reply({ embeds: [embed] });
      } catch {
        interaction.reply({
          content: "Please provide a valid command.",
          ephemeral: true,
        });
        return true;
      }
    }
  },
};
