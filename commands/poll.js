const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll.")
    .addChannelOption((option) =>
      option.setName("channel").setDescription("The channel to send the poll to.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("The title of the poll.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("options").setDescription("Separate each option by using two semicolons ( ;; )")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const language = require(`../languages/${getGuildLanguage(guildId)}`)
    const guildColor = getGuildColor(guildId);
    const title = interaction.options.getString("title")
    const channel = interaction.options.getChannel('channel')
    const optionsArray = interaction.options.getString("options").split(";;");
    const red = "rgb(235, 99, 87)";
    const blue = "rgb(99, 170, 224)";
    const green = "rgb(60, 227, 165)";
    const response = await fetch('https://quickchart.io/chart/create', {
      method: 'post',
      body: JSON.stringify({
        "backgroundColor": "rgb(255,255,255)",
        "width": 500,
        "height": 300,
        "format": "png",
        "chart": {
          type: "horizontalBar",
          data: {
            labels: optionsArray,
            datasets: [{
              data: [0, 0, 0, 0],
              backgroundColor: [red, blue, green]
            }],
          },
          options: {
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            legend: {
              display: false
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.yLabel;
                }
              }
            }
          }
        },
      }),
      headers: {'Content-Type': 'application/json'}
    });
    const initPollChart = await response.json();

    const embed = new MessageEmbed()
      .setColor(guildColor)
      .setImage(`${initPollChart.url}`)
    try {

      const row = new MessageActionRow()

      let reactions = [];
      let ugh = -1;
      optionsArray.forEach((f) => {
        ugh++
        reactions.push(0)
        row
          .addComponents(
            new MessageButton()
              .setCustomId(`${ugh}`)
              .setLabel(f)
              .setStyle('PRIMARY'),
          );
      })

      interaction.guild.channels.cache.get(channel.id).send({embeds: [embed], components: [row]}).then(message => {
        const collector = message.createMessageComponentCollector({componentType: 'BUTTON', time: 3600000 * 48}); // 48 hours
        let usersVoted = [];
        collector.on('collect', async i => {
          /*** Chart Update yada yada yada ***/
          if (usersVoted.includes(i.user.id)) return;
          reactions.splice(i.customId, 1, reactions[i.customId] += 1)
          const pollChart = `${initPollChart.url}?data1=${reactions.toString().replaceAll('"', "")}`
          const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(guildColor)
            .setImage(pollChart)
          message.edit({embeds: [embed]})
          usersVoted.push(i.user.id)
        });
      })
      interaction.reply(`${language.done}! ${channel}`)
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setTitle(language.error)
        .setDescription(`\`\`\`${e}\`\`\``)
        .setColor(0xD84343)
      interaction.reply({embeds: [errorEmbed]})
    }
  },
};
