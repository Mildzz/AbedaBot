const Database = require("better-sqlite3");
const db = new Database("guildconf.db", { verbose: console.log });

module.exports = (guildId) => {
  const guildColor = db
    .prepare(`SELECT guildColor FROM guilds WHERE guildId = '${guildId}'`)
    .pluck()
    .get();
  return guildColor;
};
