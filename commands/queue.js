module.exports = {
    name: "queue",
    aliases: ["q"],
    execute(message, args) {
        const { queues } = require("..");
        if (!queues[message.guild.id]) {
            message.channel.send("Nothing is playing.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        var page = args[0] || 1;
        if (page < 1) page = 1;
        page = page * 10;
        var i = page - 8;
        const songs = queues[message.guild.id].queue.map(songs => `${songs.info.title} - \`${songs.info.requester}\``).slice(page - 10, page);
        const songMap = songs.map(songs => `**${i++})** ${songs}`).join("\n");
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor("Queue")
            .setDescription(`**1)** ${queues[message.guild.id].currentlyPlaying.info.title} - \`${queues[message.guild.id].currentlyPlaying.info.requester}\`\n${songMap}`)
            .setFooter(`Page ${page / 10}`)
        message.channel.send(embed)
            .then(msg => msg.delete({ timeout: 10000 }));
        return message.react("✅");
    }
};
