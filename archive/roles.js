const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Send the server roles"),
  async execute(interaction, client) {
    const rolesEmbed = new MessageEmbed()
      .setTitle("Server Roles")
      .setDescription(
        `
        React with the emojis below to be pinged for the corresponding reaction.

        <:AbedaOne:886438232156413992> Announcements

        <:AbedaTwo:886438132675932191> Giveaways

        <:AbedaThree:886438162589683722> Updates
        `
      )
      .setColor(0xd84343);

    interaction.reply("done");
    const message = await interaction.channel.send({
      embeds: [rolesEmbed],
    });
    await message.react("<:AbedaOne:886438232156413992>");
    await message.react("<:AbedaTwo:886438132675932191>");
    await message.react("<:AbedaThree:886438162589683722>");
  },
};
