require("dotenv").config();
const register = require("../modules/register");
const cmds = require("../modules/cmds");
const mongo = require("../modules/mongo");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    cmds(client);
    register(client);
    mongo();
    console.log(
      `\x1b[31m%s\x1b[0m`,
      `[STATUS]`,
      `Logged in as ${client.user.tag}`
    );

    await mongo().then((mongoose) => {
      try {
        console.log(`\x1b[31m%s\x1b[0m`, `[STATUS]`, "Connected to mongo");
      } finally {
        mongoose.connection.close();
      }
    });

    client.user.setPresence({
      activities: [
        { name: `"Fall seven times, stand up eight." - Japanese proverb` },
      ],
      status: "online",
      type: "watching",
    });
  },
};
