module.exports = {
    name: "stop",
    aliases: ["dc", "leave", "quit"],
    async execute(message, args) {
        const { queues } = require("..");
        const Queue = require("../structures/queue");
        if (!queues[message.guild.id]) {
            message.channel.send("Nothing is playing.");
            return message.react("❌");
        }
        if (!message.member.voice.channel) {
            message.channel.send("You are not in a voice channel.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        if (message.guild.me.voice.channel && message.guild.me.voice.channel != message.member.voice.channel) {
            message.channel.send("You are not in my voice channel.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };

        queues[message.guild.id].queue = [];
        queues[message.guild.id].playNext();
        
        return message.react("✅");
    }
};
