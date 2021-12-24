const Database = require("better-sqlite3");
const db = new Database("guildconf.db");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if(message.author.bot) return;

    let today = new Date()
    today = today.toISOString().split('T')[0]

    const guildId = message.guildId;
    let messageCountToday = await db
      .prepare(`SELECT messageCount FROM stats WHERE date = '${today}' AND guildId = '${guildId}'`).pluck().get();

    if (messageCountToday === undefined) {
      const insert = db.prepare("INSERT INTO stats (date, guildId, messageCount) VALUES (@date, @guildId, @messageCount)");
      insert.run({
        date: today,
        guildId: guildId,
        messageCount: 0,
      });
      messageCountToday = await db
        .prepare(`SELECT messageCount FROM stats WHERE date = '${today}' AND guildId = '${guildId}'`).pluck().get();
    }

    db.exec(`UPDATE stats SET messageCount = '${+messageCountToday + 1}' WHERE date = '${today}' AND guildId = '${guildId}'`);
  },
};