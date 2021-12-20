const {SlashCommandBuilder} = require("@discordjs/builders");
const {
  MessageAttachment,
  MessageEmbed,
  Permissions,
} = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");
const re = /[0-9A-Fa-f]{6}/g;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color")
    .setDescription("Set this guild's color.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set the new server color.")
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("A valid hex code.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("get").setDescription("Get the server's color.")
    ),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)

    function setGuildColor(clr, guildId, interaction) {
      db.exec(
        `UPDATE guilds SET guildColor = '${clr}' WHERE guildId = '${guildId}'`
      );
      const {createCanvas} = require("canvas");
      const canvas = createCanvas(200, 200);
      const ctx = canvas.getContext("2d");

      ctx.arc(100, 100, 100, 0, Math.PI * 2);
      ctx.fillStyle = clr;
      ctx.fill();

      const attachment = new MessageAttachment(canvas.toBuffer(), "guildColor.png");

      const embed = new MessageEmbed()
        .setTitle(language.guildColor)
        .setDescription(`${language.setColor} \`${clr}\``)
        .setThumbnail("attachment://guildColor.png")
        .setColor(clr);
      interaction.reply({embeds: [embed], files: [attachment]});
    }

    const clr = interaction.options.getString("color");
    const guildColor = getGuildColor(guildId);

    if (interaction.options.getSubcommand() === "set") {
      if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) interaction.reply({ content: "You must have the manage server permission to do this.", ephemeral: true })
      if (re.test(clr)) {
        clr.includes("#")
          ? setGuildColor(clr, guildId, interaction)
          : setGuildColor(`#${clr}`, guildId, interaction);
      } else {
        interaction.reply({
          content: language.invalidHex,
          ephemeral: true,
        });
      }
      re.lastIndex = 0;
    } else {
      const {createCanvas} = require("canvas");
      const canvas = createCanvas(200, 200);
      const ctx = canvas.getContext("2d");

      ctx.arc(100, 100, 100, 0, Math.PI * 2);
      ctx.fillStyle = guildColor;
      ctx.fill();

      const attachment = new MessageAttachment(
        canvas.toBuffer(),
        "guildColor.png"
      );

      const embed = new MessageEmbed()
        .setTitle(language.serverColor)
        .setDescription(`${language.getColorDesc} \`${guildColor}\``)
        .setThumbnail("attachment://guildColor.png")
        .setColor(guildColor);
      interaction.reply({embeds: [embed], files: [attachment]});
    }
  },
};
