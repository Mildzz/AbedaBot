const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reaction")
    .setDescription("Create reaction roles.")
    .addStringOption((option) => option
      .setName("message-id")
      .setDescription("The ID of your message you would like to create reaction roles on."))
    .addChannelOption((option) => option
      .setName("channel")
      .setDescription("The channel that contains your message."))
    .addStringOption((option) => option
      .setName("emoji")
      .setDescription("The emoji you want to use."))
    .addRoleOption((option) => option
      .setName("role")
      .setDescription("The role you want to give")), async execute(interaction) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(guildId);
    const messageId = interaction.options.getString('message-id');
    const ch = interaction.options.getChannel('channel');
    let emoji = interaction.options.getString("emoji");
    const role = interaction.options.getRole('role').id;

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle('SUCCESS'), new MessageButton()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle('DANGER'),);

    const confirmationEmbed = new MessageEmbed()
      .setTitle('Confirm Action')
      .setDescription(`Creating reaction role on message \`${messageId}\` with the emoji ${emoji}.\n
     Does everything look correct? If so, please confirm this action by using the button below.`)
      .setColor(guildColor)

    interaction.reply({embeds: [confirmationEmbed], components: [row], fetchReply: true}).then(message => {
      const collector = message.createMessageComponentCollector({componentType: 'BUTTON', time: 120000}); // 2 mins
      collector.on('collect', async i => {
        if (i.customId === "confirm") {
          ch.messages.fetch(messageId)
            .then(async m => {
              try {
                await m.react(emoji)
                const reg = /<a?:([a-zA-Z0-9-_]{2,32}):(\d{18})>/
                const emojiId = emoji.match(reg)[2]

                /*** Fun Stuff ***/

                const Database = require("better-sqlite3");
                const db = new Database("guildconf.db");

                // noinspection SyntaxError
                const insert = db.prepare(
                  "INSERT INTO reactionRoles (guildId, messageId, channelId, role, emoji) VALUES (@guildId, @messageId, @channelId, @role, @emoji)"
                );

                // Set Command Permissions
                insert.run({
                  guildId: guildId,
                  messageId: messageId,
                  channelId: ch.id,
                  role: role,
                  emoji: emojiId,
                });

                await interaction.editReply({
                  content: "Successfully created reaction roles.",
                  embeds: [],
                  components: []
                })
              } catch (e) {
                await interaction.deleteReply()
                await interaction.followUp({
                  content: 'An error has occurred. Please make sure you have provided a valid message id.',
                  ephemeral: true
                })
                console.log(e)
              }
            })
            .catch((e) => {
              interaction.deleteReply()
              interaction.followUp({
                content: 'An error has occurred. Please make sure you have provided a valid message id.',
                ephemeral: true
              })
              console.log(e)
            })
        } else {
          await interaction.deleteReply()
          await interaction.followUp({
            content: 'Action cancelled.', ephemeral: true
          })
        }
      });
    })
  },
};
