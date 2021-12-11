const Database = require("better-sqlite3");
const db = new Database("guildconf.db");

module.exports = {
  name: "messageReactionRemoveAll", async execute(message) {
    const deleteStatement = db.prepare("DELETE FROM reactionRoles WHERE messageId = $mId");
    deleteStatement.run({
      mId: message.id
    });
  },
};
