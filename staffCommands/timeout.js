const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user.")
    .setDefaultPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The duration of time to timeout this member (in the format of 5m for minutes or 5h for hours.)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Your reason for kicking this member.")
        .setRequired(true)
    ),
  async execute(interaction, db, client) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const staffRole = await db.prepare(`SELECT StaffRole FROM guilds WHERE guildId = '${guildId}'`).pluck().get();

    if (!staffRole) {
      interaction.reply({
        content: language.noStaffRole,
        ephemeral: true,
      });
      return;
    }

    const guildColor = getGuildColor(guildId);
    const user = interaction.options.getUser("user");
    const time = interaction.options.getString("time");
    const reason = interaction.options.getString("reason");
    const regex = new RegExp(/[0-9](y|asjdioawd|d|h|m|s)/);
    if (regex.test(time) === false
    ) {
      interaction.reply({content: "Please provide a valid time (1s, 2m, 3h, 4d)", ephemeral: true})
      return;
    }

    const logChannel = db.prepare(`SELECT logChannelId FROM guilds WHERE guildId = '${guildId}'`).pluck().get();


    try {
      await interaction.guild.members.cache
        .get(user.id)
        .timeout(ms(time), reason)
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setTitle("An error has occurred.")
        .setDescription(`\`\`\`${e}\`\`\``)
        .setColor(0xd84343);
      interaction.reply({embeds: [errorEmbed]});
      return true;
    }
    const embed = new MessageEmbed()
      .setTitle("User Timed Out")
      .setDescription(`Timed out ${user} ${language.for} \`${reason}\`.`)
      .setColor(guildColor);
    interaction.reply({embeds: [embed]});

    if (logChannel) {
      const logEmbed = new MessageEmbed()
        .setTitle("User Timed Out")
        .addFields(
          {name: language.user, value: `${user}`, inline: true},
          {name: language.reason, value: `${reason}`, inline: true},
          {name: "Timed out by", value: `${interaction.user}`, inline: true},
          {
            name: language.when,
            value: `<t:${Math.round(new Date().getTime() / 1000)}:R>`,
            inline: true,
          },
          {name: "Duration", value: `${ms(ms(time), {long: true})}`}
        )
        .setColor(guildColor);

      const expireEmbed = new MessageEmbed()
        .setTitle("User Time Out")
        .setDescription(`${user}'s timeout has expired.`)
        .setColor(guildColor);

      setTimeout(() => {
        interaction.guild.channels.cache.get(logChannel).send({embeds: [expireEmbed]})
      }, ms(time));

      interaction.guild.channels.cache.get(logChannel).send({embeds: [logEmbed]})

    } else {
      interaction.channel.send(
        language.noLogsChannel
      );
    }
  },
}
;
