const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const userPerms = require("../modules/userHasPerms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Your reason for banning this member.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    if (userPerms(interaction.member, guildId) === null) {
      interaction.reply(
        `This server does not have a staff role configured. If you believe this is a mistake, please run \`/config staff {STAFF ROLE}\``
      );
    } else if (userPerms(interaction.member, guildId)) {
      const guildColor = getGuildColor(guildId);
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const Database = require("better-sqlite3");
      const db = new Database("guildconf.db", { verbose: console.log });
      const logChannel = db
        .prepare(`SELECT logChannelId FROM guilds WHERE guildId = '${guildId}'`)
        .pluck()
        .get();
      const logChannelId = logChannel.toString().replace(/[^a-zA-Z0-9 ]/g, "");

      // interaction.guild.members.cache
      //   .get(user.id)
      //   .ban({ days: 1, reason: reason });
      const embed = new MessageEmbed()
        .setTitle("User Banned")
        .setDescription(`Banned ${user} for \`${reason}\`.`)
        .setColor(guildColor);
      interaction.reply({ embeds: [embed] });

      if (logChannel) {
        const logEmbed = new MessageEmbed()
          .setTitle("User Banned")
          .addFields(
            { name: "User", value: `${user}`, inline: true },
            { name: "Reason", value: `${reason}`, inline: true },
            { name: "Banned By", value: `${interaction.user}`, inline: true },
            {
              name: "When",
              value: `<t:${Math.round(new Date().getTime() / 1000)}:R>`,
              inline: true,
            }
          )
          .setColor(guildColor);
        interaction.guild.channels.cache
          .get(logChannelId)
          .send({ embeds: [logEmbed] });
      } else {
        interaction.channel.send(
          "Please configure a log channel using `/config logs {CHANNEL}` to see logs when users are banned."
        );
      }
    } else {
      interaction.reply(
        `You do not have permission to do this. If you believe this is a mistake, please configure your server's staff role using \`/config staff {ROLE}\``,
        { ephermeral: true }
      );
    }
  },
};
