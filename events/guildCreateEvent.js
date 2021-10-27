module.exports = {
  name: "guildCreate",
  async execute(guild) {
    try {
      const Database = require("better-sqlite3");
      const db = new Database("guildconf.db");

      const insert = db.prepare(
        "INSERT INTO guilds (guildId, guildColor, logChannelId) VALUES (@guildId, @guildColor, @logChannelId)"
      );

      insert.run({
        guildId: guild.id,
        guildColor: "#d84343",
      });

      console.log(`Bot has joined \`${guild.name}\`. Saved to DB.`);
    } catch (e) {
      console.log(e);
    }
  },
};
