require("dotenv").config();
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const fs = require("fs");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const ProgressBar = require("progress");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refreshcmds")
    .setDescription("Refresh commands across all guilds."),
  async execute(interaction, client) {
    if(interaction.user.id !== "366286884495818755") interaction.reply("no")
    const guildId = interaction.guildId;
    const guildColor = getGuildColor(guildId);
    const bar = new ProgressBar('  Progress [:bar] :percent :etas', {
      complete: '='
      , incomplete: ' '
      , width: 35
      , total: client.guilds.cache.size + 1
    });
    bar.tick();

    const embed = new MessageEmbed()
      .setTitle("Refreshing Guild Commands...")
      .setColor(guildColor)

    interaction.reply({ embeds: [embed], fetchReply: true })

    const completionEmbed = new MessageEmbed()
      .setTitle("Guild Commands")
      .setDescription('All guilds have been updated with the latest commands.')
      .setColor(guildColor)

    const cmds = [];
    const commandFiles = fs
      .readdirSync(`./staffCommands/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../staffCommands/${file}`);
      cmds.push(command.data.toJSON());
    }

    const adminCommands = [];
    const adminCommandFiles = fs
      .readdirSync(`./adminCommands/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of adminCommandFiles) {
      const command = require(`../adminCommands/${file}`);
      adminCommands.push(command.data.toJSON());
    }

    const adminAndStaff = cmds.concat(adminCommands)

    const rest = new REST({
      version: "9",
    }).setToken(process.env.TOKEN);
        await (await client.guilds.fetch()).forEach(g => {
          setTimeout(async() => {
            if(g.id === "921932115409522798") {
              await rest.put(
                Routes.applicationGuildCommands(
                  process.env.CLIENTID,
                  g.id
                ),
                {body: adminAndStaff}
              );
            } else {
              await rest.put(
                Routes.applicationGuildCommands(
                  process.env.CLIENTID,
                  g.id
                ),
                {body: cmds}
              );
            }

            bar.tick();
            await interaction.editReply({ content: `${bar.lastDraw}`, fetchReply: true})

            if (bar.complete) {
              interaction.channel.send({ content: `<@${interaction.user.id}>`, embeds: [completionEmbed]})
              await interaction.deleteReply()
            }
          }, 1500)
        })
  },
};
