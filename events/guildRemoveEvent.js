module.exports = {
    name: "guildDelete",
    async execute(guild) {
      try {
        const Database = require("better-sqlite3");
        const db = new Database("guildconf.db", { verbose: console.log });
        db.exec(`DELETE FROM guilds WHERE guildId = ${guild.id}`)
      } catch (e) {
        console.log(e);
      }
    },
  };