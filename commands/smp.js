const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("smpinfo")
    .setDescription("temp")
    .addSubcommand((subcommand) =>
      subcommand.setName("info").setDescription("Basic smp info.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("rules").setDescription("smp rules.")
    ),
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === "info") {
      const smpInfo = new MessageEmbed()
        .setTitle("AbedaSMP Info")
        .setDescription(
          `Welcome to the AbedaSMP! \n\nYou must be in this Discord server to play.\n\n Version: \`1.17.1\` `
        )
        .setColor(0xd84343)
        .setFooter("Server IP: play.abeda.net");
      interaction.channel.send({ embeds: [smpInfo] });
      interaction.reply({ content: "Done.", ephemeral: true })
    } else {
      const smpRules = new MessageEmbed()
        .setTitle("AbedaSMP Rules")
        .setDescription(
          `Not all rules are listed here, use common sense please.`
        )
        .setColor(0xd84343)
        .addField(
          "\nServer Rules",
          `
          No raiding/griefing.\n\n Respect all players and staff.\n\n No hacking/cheating/x-ray mods\n\n No lag machines.\n \n Skins must be SFW.\n\n PVP is not allowed unless both players agree.
          `
        )
        .setFooter("Server IP: play.abeda.net");
      interaction.channel.send({ embeds: [smpRules] });
      interaction.reply({ content: "Done.", ephemeral: true })
    }
  },
};
