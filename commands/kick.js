const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Your reason for kicking this member.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const guildColor = getGuildColor(guildId);
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const Database = require("better-sqlite3");
    const db = new Database("guildconf.db", { verbose: console.log });
    const logChannel = db
      .prepare(`SELECT logChannelId FROM guilds WHERE guildId = '${guildId}'`)
      .pluck()
      .get();

    // interaction.guild.members.cache.get(user.id).ban({ days: 1, reason: reason })
    const embed = new MessageEmbed()
      .setTitle("User Kicked")
      .setDescription(`Kicked ${user} for \`${reason}\`.`)
      .setColor(guildColor);
    interaction.reply({ embeds: [embed] });

    if (logChannel) {
      const logChannelId = logChannel.toString().replace(/[^a-zA-Z0-9 ]/g, "");
      const logEmbed = new MessageEmbed()
        .setTitle("User Kicked")
        .addFields(
          { name: "User", value: `${user}`, inline: true },
          { name: "Reason", value: `${reason}`, inline: true },
          { name: "Kicked By", value: `${interaction.user}`, inline: true },
          {
            name: "When",
            value: `<t:${Math.round((new Date()).getTime() / 1000)}:R>`,
            inline: true,
          }
        )
        .setColor(guildColor);
      interaction.guild.channels.cache
        .get(logChannelId)
        .send({ embeds: [logEmbed] });
    } else {
      interaction.channel.send(
        "Please configure a log channel using `/config logs {CHANNEL}` to see logs when users are kicked."
      );
    }
  },
};
