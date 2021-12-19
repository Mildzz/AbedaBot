const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");

Date.prototype.getUnixTime = function () {
  return (this.getTime() / 1000) | 0;
};
if (!Date.now)
  Date.now = function () {
    return new Date();
  };
Date.time = function () {
  return Date.now().getUnixTime();
};

function dhm(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);
  return (
    days +
    " days " +
    hours +
    " hours " +
    minutes +
    " minutes " +
    sec +
    " seconds "
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get bot or guild info.")
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Get guild info.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Get user info.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Any user.").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("bot").setDescription("Get AbedaBot info.")
    ),
  async execute(interaction) {
    const client = interaction.client;
    const guild = interaction.guild;
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(guildId);

    if (interaction.options.getSubcommand() === "server") {
      const embed = new MessageEmbed()
        .setTitle(language.serverInfo)
        .addFields(
          {name: language.name, value: `${guild.name}`, inline: true},
          {name: language.owner, value: `<@${guild.ownerId}>`, inline: true},
          {name: language.language, value: `${guild.preferredLocale}`, inline: true},
          {name: language.members, value: `${guild.memberCount}`, inline: true},
          {
            name: language.created,
            value: `<t:${new Date(guild.createdAt.getTime()).getUnixTime()}>`,
            inline: true,
          }
        )
        .setThumbnail(guild.iconURL())
        .setColor(guildColor);
      interaction.reply({embeds: [embed]});
    } else if (interaction.options.getSubcommand() === "bot") {
      const embed = new MessageEmbed()
        .setTitle(language.botInfo)
        .addFields(
          {name: language.name, value: `${client.user.username}`, inline: true},
          {name: language.creator, value: `<@366286884495818755>`, inline: true},
          {
            name: language.created,
            value: `<t:${new Date(
              client.user.createdAt.getTime()
            ).getUnixTime()}>`,
            inline: true,
          },
          {name: language.version, value: `${process.env.VERSION}`, inline: true},
          {name: language.uptime, value: `${dhm(client.uptime)}`, inline: true},
          {name: language.commands, value: `${client.commands.size}`, inline: true},
          {name: "Staff Commands", value: `${client.staffCommands.size}`, inline: true},
          {name: "Guild Count", value: `${client.guilds.cache.size}`, inline: true}
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(guildColor);
      interaction.reply({embeds: [embed]});
    } else {
      const user = interaction.options.getUser("user");
      const member = guild.members.cache.get(user.id);
      const embed = new MessageEmbed()
        .setTitle(`${language.userInfo} (***${user.tag}***)`)
        .addFields(
          {
            name: language.status,
            value: `${member.presence.status ?? "offline"}`,
            inline: true,
          },
          {
            name: language.game,
            value: `${member.presence.activities[0] ?? language.none}`,
            inline: true,
          },
          {
            name: language.nickname,
            value: `${member.nickname ?? "None"}`,
            inline: true,
          },
          {
            name: language.created,
            value: `<t:${new Date(user.createdAt.getTime()).getUnixTime()}>`,
            inline: true,
          },
          {
            name: language.joined,
            value: `<t:${new Date(member.joinedTimestamp).getUnixTime()}>`,
            inline: true,
          },
          {name: language.bot, value: `${user.bot}`, inline: true}
        )
        .setThumbnail(user.displayAvatarURL())
        .setColor(member.displayHexColor);
      interaction.reply({embeds: [embed]});
    }
  },
};
