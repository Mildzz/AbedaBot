const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");
require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure settings for your guild.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("logs")
        .setDescription("The log channel for your guild.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Your logs channel.")
            .setRequired(true)
            .addChannelTypes([0])
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("staff")
        .setDescription("The staff role for your guild.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Your staff role.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("language")
        .setDescription("The language for your guild.")
    ),
  async execute(interaction, db, client) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(interaction.guildId);
    if (interaction.member.id !== interaction.guild.ownerId) {
      interaction.reply(language.notOwner);
    } else {
      if (interaction.options.getSubcommand() === "logs") {
        const logChannel = interaction.options.getChannel("channel");
        if(logChannel.type !== "GUILD_TEXT") interaction.reply({ content: "Please select a text channel.", ephemeral: true })
        const logChannelId = logChannel
          .toString()
          .replace(/[^a-zA-Z0-9 ]/g, "");
        db.exec(`UPDATE guilds SET logChannelId = '${logChannelId}' WHERE guildId = '${guildId}'`);
        let embed = new MessageEmbed()
          .setTitle(language.logChannel)
          .setDescription(
            `${language.logChannelDesc} ${logChannel}`
          )
          .setColor(guildColor);
        interaction.reply({embeds: [embed]});
      } else if (interaction.options.getSubcommand() === "staff") {
        const staffRole = interaction.options.getRole("role");
        const staffRoleId = staffRole.toString().replace(/[^a-zA-Z0-9 ]/g, "");
        db.exec(
          `UPDATE guilds SET staffRole = '${staffRoleId}' WHERE guildId = '${guildId}'`
        );
        try {
          // Set Command Permissions

          const Database = require("better-sqlite3");
          const db = new Database("guildconf.db");

          const staffRole = await db
            .prepare(
              `SELECT StaffRole FROM guilds WHERE guildId = '${interaction.guild.id}'`
            )
            .pluck()
            .get();

          /*** Set Permissions ***/

          if (staffRole) {
            const cmds = [];
            (await interaction.guild.commands.fetch()).forEach(cmd => {
              cmds.push(
                {"name": cmd.name, "commandId": cmd.permissions.commandId}
              )
            })

            const banId = cmds.find(({name}) => name === 'ban').commandId;
            const kickId = cmds.find(({name}) => name === 'kick').commandId;
            const clearId = cmds.find(({name}) => name === 'clear').commandId;
            const timeoutId = cmds.find(({name}) => name === 'timeout').commandId;

            const fullPermissions = [
              {
                id: banId,
                permissions: [{
                  id: staffRole,
                  type: 'ROLE',
                  permission: true,
                }],
              },
              {
                id: kickId,
                permissions: [{
                  id: staffRole,
                  type: 'ROLE',
                  permission: true,
                }],
              },
              {
                id: clearId,
                permissions: [{
                  id: staffRole,
                  type: 'ROLE',
                  permission: true,
                }],
              },
              {
                id: timeoutId,
                permissions: [{
                  id: staffRole,
                  type: 'ROLE',
                  permission: true,
                }],
              },
            ];

            await interaction.guild?.commands.permissions.set({fullPermissions});

            const embed = new MessageEmbed()
              .setTitle(language.staffChannel)
              .setDescription(
                `${language.staffChannelDesc} ( <@&${staffRole}> )`
              )
              .setColor(guildColor);
            interaction.reply({embeds: [embed]});
          }
        } catch (e) {
          const errorEmbed = new MessageEmbed()
            .setDescription(`\`\`\`${e}\`\`\``)
            .setColor(0xd84343);
          interaction.reply({embeds: [errorEmbed]});
          console.log(e)
        }
      } else if (interaction.options.getSubcommand() === "language") {
        const embed = new MessageEmbed()
          .setTitle(`Guild ${language.language}`)
          .setDescription(
            "Please select a language below."
          )
          .setColor(guildColor);

        const row = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("language")
            .setPlaceholder("Please Choose a Language")
            .addOptions([
              {
                label: "English",
                description: "Set this guild's language to english.",
                value: "en-US",
              },
              {
                label: "Norsk",
                description: "Sett spr??ket i botten til norsk.",
                value: "no",
              }
            ])
        );
        interaction.reply({embeds: [embed], components: [row]});
      }
    }

  },
};
