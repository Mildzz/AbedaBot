const Database = require("better-sqlite3");
const db = new Database("guildconf.db");

module.exports = (guildId) => {
  return db
      .prepare(`SELECT guildColor FROM guilds WHERE guildId = '${guildId}'`)
      .pluck()
      .get();
};
