const mongoose = require('mongoose')

const GuildConfigSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    defaultRole: {
        type: String,
        required: false,
    },
    memberLogChannel: {
        type: [Object],
        required: false,
    },
    guildColor: {
        type: String,
        required: false,
    }
})

module.exports = mongoose.model('GuildConfig', GuildConfigSchema)