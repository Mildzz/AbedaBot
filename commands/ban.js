const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");

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
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const Database = require("better-sqlite3");
    const db = new Database("guildconf.db");
    const staffRole = await db
      .prepare(`SELECT staffRole FROM guilds WHERE guildId = '${guildId}'`)
      .pluck()
      .get();

    if (!staffRole) {
      interaction.reply({
        content: `This server does not have a staff role configured. If you believe this is a mistake, please run \`/config staff {STAFF ROLE}\``,
        ephemeral: true,
      });
    } else {
      if (!client.application?.owner) await client.application?.fetch();

      const command = await client.guilds.cache
        .get("886114589102714890")
        ?.commands.fetch(interaction.commandId);

      const permissions = [
        {
          id: `${staffRole}`,
          type: "ROLE",
          permission: true,
        },
      ];

      await command.permissions.add({ permissions });

      const guildColor = getGuildColor(guildId);
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const logChannel = db
        .prepare(`SELECT logChannelId FROM guilds WHERE guildId = '${guildId}'`)
        .pluck()
        .get();

      try {
        await interaction.guild.members.cache
          .get(user.id)
          .ban({ days: 1, reason: reason });
      } catch (e) {
        const errorEmbed = new MessageEmbed()
          .setTitle("An error has occured.")
          .setDescription(`${e}`)
          .setColor(0xd84343);
        interaction.reply({ embeds: [errorEmbed] });
        return true;
      }
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
          .get(logChannel)
          .send({ embeds: [logEmbed] });
      } else {
        interaction.channel.send(
          "Please configure a log channel using `/config logs {CHANNEL}` to see logs when users are banned."
        );
      }
    }
  },
};
