module.exports = {
    name: "queue",
    aliases: ["q"],
    execute(message, args) {
        const { queue } = require("../index");
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[0]) {
            message.channel.send("Nothing is playing.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        try {
            var page = args[0] || 1;
            if (page < 1) page = 1;
            page = page * 10;
            var i = page - 9;
            const songs = serverQueue.songs.map(songs => `${songs.title} - \`${songs.requester}\``).slice(page - 10, page);
            const songMap = songs.map(songs => `**${i++})** ${songs}`).join("\n");
            const Discord = require("discord.js");
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor("Queue")
                .setDescription(`${songMap}`)
                .setFooter(`Page ${page / 10}`)
            message.channel.send(embed)
                .then(msg => msg.delete({ timeout: 10000 }));
            return message.react("✅");
        } catch (error) {
            message.channel.send(`${error}`);
            return message.react("❌");
        };
    }
};
