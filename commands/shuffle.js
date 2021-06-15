module.exports = {
    name: "shuffle",
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
        const np = serverQueue.songs[0];
        serverQueue.songs.shift();
        serverQueue.songs = serverQueue.songs.sort(() => Math.random() - 0.5);
        serverQueue.songs.unshift(np);
        return message.react("✅");
    }
};
