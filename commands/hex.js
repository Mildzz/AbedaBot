const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
var re = /[0-9A-Fa-f]{6}/g;

function getColor(json, interaction) {
  const { createCanvas } = require("canvas");
  const canvas = createCanvas(200, 200);
  var ctx = canvas.getContext("2d");

  ctx.arc(100, 100, 100, 0, Math.PI * 2);
  ctx.fillStyle = json.hex.value;
  ctx.fill();

  const attachment = new MessageAttachment(canvas.toBuffer(), "guildColor.png");
  const embed = new MessageEmbed()
    .setTitle(`Hex Color ***(${json.name.value})***`)
    .addField("Hex Code", `${json.hex.value}`)
    .addField("Rgb Value", `${json.rgb.value}`)
    .setThumbnail("attachment://guildColor.png")
    .setColor(json.hex.value);
  interaction.editReply({ embeds: [embed], files: [attachment] });
}

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
    const color = interaction.options.getString("color");
    await interaction.deferReply();

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
        interaction.editReply({
          content: "Please provide a valid hex code.",
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
