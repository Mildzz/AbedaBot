const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");

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
  async execute(interaction) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(guildId);
    const cmd = interaction.options.getString("command");

    if (!cmd) {
      const noCmdEmbed = new MessageEmbed()
        .setTitle(`AbedaBot ${language.help}`)
        .setDescription(
          language.specCmd
        )
        .setColor(guildColor);

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel(`${language.invite} AbedaBot`)
          .setStyle("LINK")
          .setURL(
            "https://discord.com/api/oauth2/authorize?client_id=899506459031785482&permissions=38050809959&scope=bot%20applications.commands"
          ),
        new MessageButton()
          .setLabel(language.commands)
          .setStyle("LINK")
          .setURL("https://abeda.net/commands")
      );

      await interaction.reply({embeds: [noCmdEmbed], components: [row]});
    } else {
      try {
        const command = interaction.client.commands.get(cmd.toLowerCase()).data;
        const options = [];
        command.options.forEach((e) => {
          options.push(capitalize(e.name));
        });
        const embed = new MessageEmbed()
          .setTitle(`AbedaBot ${language.help}`)
          .addFields(
            {
              name: language.help,
              value: `${capitalize(command.name)} `,
              inline: true,
            },
            {
              name: language.description,
              value: `${command.description} `,
              inline: true,
            },
            {name: language.options, value: `${options.toString() || language.none} `, inline: true},
            {name: language.defaultPerm, value: `${command.defaultPermission ?? language.yes}`, inline: true}
          )
          .setColor(guildColor);
        interaction.reply({embeds: [embed]});
      } catch (e) {
        console.log(e)
        interaction.reply({
          content: language.invalidCommands,
          ephemeral: true,
        });
        return true;
      }
    }
  },
};
