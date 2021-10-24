const Database = require("better-sqlite3");
const db = new Database("guildconf.db", { verbose: console.log });

module.exports = (member, guildId) => {
  const staffRole = db
    .prepare(`SELECT staffRole FROM guilds WHERE guildId = '${guildId}'`)
    .pluck()
    .get();
  if (staffRole) {
    if (
      member.roles.cache.has(staffRole.toString().replace(/[^a-zA-Z0-9 ]/g, ""))
    ) {
      return true;
    } else return false;
  } else return null;
};
