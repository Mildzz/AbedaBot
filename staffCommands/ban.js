require("dotenv").config();
const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");

// Functions
async function banMember(interaction, member, reason, deleteMessages) {
  if (deleteMessages === true) {
    await interaction.guild.members.cache
      .get(member.id)
      .ban({days: deleteMessages, reason: reason});
  } else {
    await interaction.guild.members.cache
      .get(member.id)
      .ban({reason: reason});
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .setDefaultPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Your reason for banning this member.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("delete-messages")
        .setDescription("Do you want to delete this member's messages?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const Database = require("better-sqlite3");
    const db = new Database("guildconf.db");
    const staffRole = await db
      .prepare(`SELECT StaffRole FROM guilds WHERE guildId = '${guildId}'`)
      .pluck()
      .get();

    if (!staffRole) {
      interaction.reply({
        content: language.noStaffRole,
        ephemeral: true,
      });
    } else {
      const guildColor = getGuildColor(guildId);
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const delMessages = interaction.options.getBoolean("delete-messages")
      const logChannel = db
        .prepare(`SELECT logChannelId FROM guilds WHERE guildId = '${guildId}'`)
        .pluck()
        .get();

      try {
        await banMember(interaction, user, reason, delMessages)
      } catch (e) {
        const errorEmbed = new MessageEmbed()
          .setTitle("An error has occurred.")
          .setDescription(`\`\`\`${e}\`\`\``)
          .setColor(0xd84343);
        interaction.reply({ embeds: [errorEmbed] });
        console.log(e)
        return true;
      }
      const embed = new MessageEmbed()
        .setTitle(language.userBanned)
        .setDescription(`${language.banned} ${user} ${language.for} \`${reason}\`.`)
        .setColor(guildColor);
      interaction.reply({embeds: [embed]});

      if (logChannel) {
        const logEmbed = new MessageEmbed()
          .setTitle(language.userBanned)
          .addFields(
            {name: language.user, value: `${user}`, inline: true},
            {name: language.reason, value: `${reason}`, inline: true},
            {name: language.bannedBy, value: `${interaction.user}`, inline: true},
            {
              name: language.when,
              value: `<t:${Math.round(new Date().getTime() / 1000)}:R>`,
              inline: true,
            }
          )
          .setColor(guildColor);
        interaction.guild.channels.cache
          .get(logChannel)
          .send({embeds: [logEmbed]});
      } else {
        interaction.channel.send(
          language.noLogsChannel
        );
      }
    }
  },
};
