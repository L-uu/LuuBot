module.exports = {
    name: "loop",
    execute(message) {
        const { queue } = require("../index");
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            message.channel.send("Nothing is playing.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        if (message.member.voice.channel != message.guild.me.voice.channel) {
            message.channel.send("You must be in my voice channel.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        if (!serverQueue.loop) {
            serverQueue.loop = true;
            message.channel.send("Looping enabled.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("✅");
        } else {
            serverQueue.loop = false;
            message.channel.send("Looping disabled.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("✅");
        };
    }
};
