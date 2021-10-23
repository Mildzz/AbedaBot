const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Send the server rules"),
  async execute(interaction, client) {
    const rulesEmbed = new MessageEmbed()
      .setTitle("Server Rules")
      .setDescription(
        `
        ***Failing to follow these rules will result in punishment***

        **1. Be respectful**
            You must respect all users, regardless of your liking towards them. Treat others the way you want to be treated.

            **2. No Inappropriate Language**
            The use of profanity should be kept to a minimum. However, any derogatory language towards any user is prohibited.

            **3. No spamming**
            Don't send many messages right after each other. Do not disrupt chat by spamming.

            **4. No pornographic/adult/other NSFW material**
            This is a community server and not meant to share this kind of material.

            **5. No advertisements**
            We do not tolerate any kind of advertisements, whether it be for other communities or streams.

            **6. No offensive names and profile pictures**
            You will be asked to change your name or picture if the staff deems them inappropriate.

            **7. Server Raiding**
            Raiding or mentions of raiding are not allowed.

            **8. Direct & Indirect Threats**
            Threats to other users of DDoS, Death, DoX, abuse, and other malicious threats are absolutely prohibited and disallowed.

            **9. Follow the Discord Community Guidelines**
            You can find them here: https://discord.com/guidelines

            **The Admins and Mods will Mute/Kick/Ban per discretion. If you feel mistreated dm an Admin and we will resolve the issue.**

            All Channels will have channel topics explaining what they are there for and how everything works. If you don't understand something, feel free to ask!

            **Your presence in this server implies accepting these rules, including all further changes. These changes might be done at any time without notice.**
        `
      )
      .setColor(0xd84343);

    const verifyEmbed = new MessageEmbed()
      .setTitle("Verification")
      .setDescription(
        "After you have read the rules, please verify below by clicking the <:AbedaCheck:886484165971816468>"
      )
      .setColor(0xd84343);

    interaction.reply("done");
    const message = await interaction.channel.send({
      embeds: [rulesEmbed, verifyEmbed],
    });
    await message.react("<:AbedaCheck:886484165971816468>");
  },
};
