const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageAttachment,
  MessageEmbed,
} = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db");
const getGuildColor = require("../modules/getGuildColor");

const re = /[0-9A-Fa-f]{6}/g;

function setGuildColor(clr, guildId, interaction) {
  db.exec(
    `UPDATE guilds SET guildColor = '${clr}' WHERE guildId = '${guildId}'`
  );
  const { createCanvas } = require("canvas");
  const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext("2d");

    ctx.arc(100, 100, 100, 0, Math.PI * 2);
  ctx.fillStyle = clr;
  ctx.fill();

  const attachment = new MessageAttachment(canvas.toBuffer(), "guildColor.png");

  const embed = new MessageEmbed()
    .setTitle("Guild Color")
    .setDescription(`You have succesfully set the guild color to \`${clr}\``)
    .setThumbnail("attachment://guildColor.png")
    .setColor(clr);
  interaction.reply({ embeds: [embed], files: [attachment] });
}

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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("profile")
        .setDescription("Set the server's color profile.")
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const clr = interaction.options.getString("color");
    const guildColor = getGuildColor(guildId);

    if (interaction.options.getSubcommand() === "profile") {
      const embed = new MessageEmbed()
        .setTitle("Guild Color")
        .setDescription(
          "Please select a color profile below or set your own with `/color set {HEX_CODE}`"
        )
        .setColor(guildColor);

      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("colorprofile")
          .setPlaceholder("Please Choose a Color Profile")
          .addOptions([
            {
              label: "Default",
              description: "Set this guild's color to default (#d84343).",
              value: "#d84343",
            },
            {
              label: "Red",
              description: "Set this guild's color to red.",
              value: "#e23838",
            },
            {
              label: "Orange",
              description: "Set this guild's color to orange.",
              value: "#f78200",
            },
            {
              label: "Yellow",
              description: "Set this guild's color to yellow.",
              value: "#ffb900",
            },
            {
              label: "Green",
              description: "Set this guild's color to green.",
              value: "#5ebd3e",
            },
            {
              label: "Blue",
              description: "Set this guild's color to blue.",
              value: "#009cdf",
            },
            {
              label: "Purple",
              description: "Set this guild's color to purple.",
              value: "#973999",
            },
          ])
      );
      interaction.reply({ embeds: [embed], components: [row] });
    } else if (interaction.options.getSubcommand() === "set") {
      if (re.test(clr)) {
        clr.includes("#")
          ? setGuildColor(clr, guildId, interaction)
          : setGuildColor(`#${clr}`, guildId, interaction);
      } else {
        interaction.reply({
          content: "Please provide a valid hex code.",
          ephemeral: true,
        });
      }
      re.lastIndex = 0;
    } else {
      const { createCanvas } = require("canvas");
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
        .setTitle("Server Color")
        .setDescription(`This server's color is \`${guildColor}\``)
        .setThumbnail("attachment://guildColor.png")
        .setColor(guildColor);
      interaction.reply({ embeds: [embed], files: [attachment] });
    }
  },
};
