const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specified amount of messages.")
    .setDefaultPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("messages")
        .setDescription("Amount of messages to delete.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;

    if (!staffRole) {
      interaction.reply({
        content: `This server does not have a staff role configured. If you believe this is a mistake, please run \`/config staff {STAFF ROLE}\``,
        ephemeral: true,
      });
    } else {
      if (!client.application?.owner) await client.application?.fetch();

      const guildCommand = await client.guilds.cache
        .get(process.env.GUILDID)
        ?.commands.fetch(interaction.commandId);
      const globalCommand = client.application?.commands.fetch(
        interaction.commandId
      );

      const permissions = [
        {
          id: `${staffRole}`,
          type: "ROLE",
          permission: true,
        },
      ];

      process.env.DEBUG === "true"
        ? await guildCommand.permissions.add({ permissions })
        : await globalCommand.permissions.add({ permissions });

      const amount = interaction.options.getInteger("messages");
      const errorEmbed = new MessageEmbed()
        .setTitle("An error has occured")
        .setColor(0xd84343);

      if (amount > 100 || amount < 2) {
        errorEmbed.setDescription(
          "Please enter an amount of messages between 1 & 100."
        );
        interaction.reply({ embeds: [errorEmbed] });
      } else {
        interaction.channel
          .bulkDelete(amount, true)
          .then((messages) =>
            interaction.reply({
              content: `Cleared ${messages.size} messages.`,
              ephemeral: true,
            })
          )
          .catch((e) => {
            errorEmbed.setDescription(`\`\`\`${e}\`\`\``);
            interaction.reply({ embeds: [errorEmbed] });
          });
      }
    }
  },
};
