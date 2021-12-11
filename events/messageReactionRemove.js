const Database = require("better-sqlite3");
const db = new Database("guildconf.db");

module.exports = {
  name: "messageReactionRemove", async execute(reaction, user) {

    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return
    const guildId = reaction.guildId;

    if (await db.prepare(`SELECT emoji FROM reactionRoles WHERE messageId = '${reaction.message.id}'`).pluck().get() === undefined) return;

    const role = await db
      .prepare(`SELECT role FROM reactionRoles WHERE messageId = '${reaction.message.id}'`)
      .pluck()
      .get();
    const emoji = await db
      .prepare(`SELECT emoji FROM reactionRoles WHERE messageId = '${reaction.message.id}'`)
      .pluck()
      .get();
    if(reaction.emoji.id === emoji) {
      try {
        await reaction.message.guild.members.cache
          .get(user.id)
          .roles.remove(role);
      } catch {

      }
    }
  },
};
