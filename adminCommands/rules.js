const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");

module.exports = {
  data: new SlashCommandBuilder().setName("rules").setDescription("test"),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(guildId);

    const ruleEmbed = new MessageEmbed()
      .setTitle("Server Rules")
      .setDescription("Failing to follow these rules **will** result in punishment.")
      .setColor(guildColor)
      .addFields(
        {name: "1. Be Respectful", value: "You must respect all users, regardless of your liking towards them."},
        {name: "2. No Harmful Language", value: "The use of profanity should be kept low and any derogatory language towards any user is prohibited."},
        {name: "3. No Spamming", value: "Sending multiple messages after each other (spam) is not allowed."},
        {name: "4. No Pornographic/Adult/Other NSFW Material", value: "This is a community server and it not meant for this kind of material."},
        {name: "5. No Advertising", value: "We do not tolerate any kind of advertisements."},
        {name: "6. No Offensive Names or Profile Pictures", value: "You will be asked to change your name or profile picture if staff deems them innapropriate. Failing to follow the request will result in a kick."},
        {name: "7. Server Raiding", value: "Raiding or mentions of raiding are not allowed."},
        {name: "8. Direct & Indirect Threats", value: "Threats to other users of DDoS, Death, DoX, abuse, and other malicious threats are prohibited."},
        {name: "9. Follow the Discord Community Guidelines", value: "You can find them [here](https://discord.com/guidelines) \n\n **The adminds and mods will mute/kick/ban per discretion. If you feel mistreated, dm an admin and we will resolve the issue.** \n\n All channels have channel topics explaining what they are for. If you have any questions, feel free to ask! \n\n **Your presence in this server implies accepting these rules, including all further changes. These changes might be done at any time without notice.**"}
      )

    const verifyEmbed = new MessageEmbed()
      .setTitle("Verification")
      .setDescription("After you have read the rules, please verify below by clicking the <:AbedaCheck:886484165971816468>")
      .setColor(guildColor)
    await interaction.client.guilds.cache.get("886114589102714890")?.rulesChannel.send({embeds: [ruleEmbed, verifyEmbed]});
    interaction.reply({ content: "Rules sent.", ephemeral: true })
  },
};
