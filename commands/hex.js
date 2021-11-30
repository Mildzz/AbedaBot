const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const fetch = require("node-fetch");
const re = /[0-9A-Fa-f]{6}/g;
const getGuildLanguage = require("../modules/getGuildLanguage");
const {createCanvas} = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hex")
    .setDescription("Generate or lookup a hex code.")
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("A valid hex code you would like to look up.")
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)

    function getColor(json, interaction) {
      const {createCanvas} = require("canvas");
      const canvas = createCanvas(200, 200);
      const ctx = canvas.getContext("2d");

      ctx.arc(100, 100, 100, 0, Math.PI * 2);
      ctx.fillStyle = json.hex.value;
      ctx.fill();

      const attachment = new MessageAttachment(canvas.toBuffer(), "guildColor.png");
      const embed = new MessageEmbed()
        .setTitle(`${language.hexColor} ***(${json.name.value})***`)
        .addField(language.hexCode, `${json.hex.value}`)
        .addField(language.rgbValue, `${json.rgb.value}`)
        .setThumbnail("attachment://guildColor.png")
        .setColor(json.hex.value);
      interaction.editReply({embeds: [embed], files: [attachment]});
    }

    const color = interaction.options.getString("color");
    await interaction.deferReply();

    let noHashColor;
    if (color) {
      if (re.test(color)) {
        color.includes("#")
          ? (noHashColor = color.slice(1))
          : (noHashColor = color);
        fetch(`https://www.thecolorapi.com/id?hex=${noHashColor}`)
          .then((res) => res.json())
          .then((json) => {
            getColor(json, interaction);
          });
      } else {
        await interaction.editReply({
          content: language.invalidHex,
          ephemeral: true,
        });
      }
      re.lastIndex = 0;
    } else {
      fetch("https://www.thecolorapi.com/random")
        .then((res) => res.json())
        .then((json) => {
          getColor(json, interaction);
        });
    }
  },
};
