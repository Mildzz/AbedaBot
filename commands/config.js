const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, Message} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const Database = require("better-sqlite3");
const fs = require("fs");
const db = new Database("guildconf.db");

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
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("staff")
                .setDescription("The staff role for your guild.")
                .addMentionableOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Your staff role.")
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        const guildId = interaction.guildId;
        const guildColor = getGuildColor(interaction.guildId);
        if (interaction.member.id !== interaction.guild.ownerId) {
            interaction.reply("Only the server owner may execute this command.");
        } else {
            if (interaction.options.getSubcommand() === "logs") {
                const logChannel = interaction.options.getChannel("channel");
                const logChannelId = logChannel
                    .toString()
                    .replace(/[^a-zA-Z0-9 ]/g, "");
                db.exec(
                    `UPDATE guilds SET logChannelId = '${logChannelId}' WHERE guildId = '${guildId}'`
                );
                const embed = new MessageEmbed()
                    .setTitle("Log Channel")
                    .setDescription(
                        `Your server's log channel has been set to ${logChannel}`
                    )
                    .setColor(guildColor);
                interaction.reply({embeds: [embed]});
            } else if (interaction.options.getSubcommand() === "staff") {
                const staffRole = interaction.options.getMentionable("role");
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
                        ];

                        await interaction.guild?.commands.permissions.set({fullPermissions});

                        interaction.reply("Successfully updated staff role!");
                    }
                } catch (e) {
                    const errorEmbed = new MessageEmbed()
                        .setDescription(`\`\`\`${e}\`\`\``)
                        .setColor(0xd84343);
                    interaction.reply({embeds: [errorEmbed]});
                }
            }
        }
    },
};
