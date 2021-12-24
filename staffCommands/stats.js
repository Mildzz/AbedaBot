const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const getGuildColor = require("../modules/getGuildColor");
const getGuildLanguage = require("../modules/getGuildLanguage");
const Database = require("better-sqlite3");
const db = new Database("guildconf.db");

// Functions
const getDaysArray = function (start, end) {
  let arr = [];
  let dt = new Date(start);
  for (; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

function change(a, b) {
  let percent;
  if (b !== 0) {
    if (a !== 0) {
      percent = (b - a) / a * 100;
    } else {
      percent = b * 100;
    }
  } else {
    percent = -a * 100;
  }
  return Math.floor(percent);
}

async function getDbEntry(guildId, date, date2) {
  if(date2) {
    return await db
      .prepare(`SELECT messageCount FROM stats WHERE guildId = '${guildId}' AND date BETWEEN '${date}' AND '${date2}'`).all();
  } else {
    return await db
      .prepare(`SELECT messageCount FROM stats WHERE guildId = '${guildId}' AND date = '${date}'`).pluck().get()
  }
}

// Variables

let today = new Date();
today = today.toISOString().split('T')[0]
// Yesterday
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday = yesterday.toISOString().split('T')[0]
// 7 Days Ago
let sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
sevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0]
// 14 Days Ago
let fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
fourteenDaysAgo = fourteenDaysAgo.toISOString().split('T')[0]

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows your server statistics."),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const guildColor = getGuildColor(guildId);

    const dbToday = await getDbEntry(guildId, today)
    let dbYesterday = await getDbEntry(guildId, yesterday)
    let dbSevenDaysAgo = await getDbEntry(guildId, sevenDaysAgo)
    let dbFourteenDaysAgo = await getDbEntry(guildId, fourteenDaysAgo)
    let dbPastWeek = await getDbEntry(guildId, sevenDaysAgo, today)

    const messageCountArray = [];

    // Make the array have 8 entries.

    dbPastWeek.forEach(m => {
      messageCountArray.push(+m.messageCount)
    })
    for (let i = 0; i < 8; i++) {
      if (messageCountArray.length === 8) {
        break;
      }
      messageCountArray.push(NaN)
    }

    // Make sure values are not undefined
    dbYesterday = dbYesterday ?? 0;
    dbSevenDaysAgo = dbSevenDaysAgo ?? 0;
    dbFourteenDaysAgo = dbFourteenDaysAgo ?? 0;

    // Emojis

    const upEmoji = "<:Up:923420513005621260>";
    const downEmoji = "<:Down:923420531116605510>";
    let emoji1, emoji2;
    (Math.sign(change(+dbYesterday, +dbToday)) === -1) ? emoji1 = downEmoji : emoji1 = upEmoji;
    (Math.sign(change(+dbSevenDaysAgo, +dbToday)) === -1) ? emoji2 = downEmoji : emoji2 = upEmoji;

    // Create the graph
    const initArray = getDaysArray(new Date(sevenDaysAgo), new Date(today)).reverse();
    const dateArray = initArray.map((v) => v.toISOString().slice(0, 10)).join(",");

    const embed = new MessageEmbed()
      .setTitle(`${interaction.guild.name} Statistics`)
      .addFields(
        {name: 'Message Count Today', value: `${dbToday}`, inline: true},
        {name: 'Message Count Yesterday', value: `${dbYesterday}`, inline: true},
        {name: 'Message Count 7 Days Ago', value: `${dbSevenDaysAgo}`, inline: true},
        {name: 'Message Count Change (24 hours)', value: `${emoji1} ${change(+dbYesterday, +dbToday)}%`, inline: true},
        {name: 'Message Count Change (7 Days)', value: `${emoji2} ${change(+dbSevenDaysAgo, +dbToday)}%`, inline: true}
      )
      .setColor(guildColor)
      .setImage(`https://quickchart.io/chart/render/zm-58a99776-e2d2-4c99-a2d2-5d729fecbd57?labels=${dateArray}&data1=${messageCountArray}`);

    +dbToday !== 0 ? await interaction.reply({embeds: [embed]}) : interaction.reply({
      content: "No data for today.",
      ephemeral: true
    })
  },
};
