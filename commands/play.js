module.exports = {
    name: "play",
    aliases: ["p"],
    async execute(message, args) {
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
        if (!args[0]) {
            message.channel.send("Please provide a search string or URL.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };

        const { queues } = require("..");
        const Queue = require("../structures/queue");
        if (!queues[message.guild.id])
            queues[message.guild.id] = new Queue(message.guild.id, message.member.voice.channel.id, message.channel);

        const [ song ] = await queues[message.guild.id].search(args.join(" "));
        if (!song) return message.channel.send("No results found.");
        
        song.info.requester = message.author.username;

        const getThumb = require("video-thumbnail-url");
        const thumbnail = getThumb(song.info.uri);

        const isAdded = await queues[message.guild.id].play(song);
        if (isAdded) {
            const { MessageEmbed } = require("discord.js");
            message.channel.send(
                new MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor("Added to Queue")
                    .setTitle(`${song.info.title}`)
                    .setImage(`${thumbnail._rejectionHandler0}`)
            ).then(msg => msg.delete({ timeout: 5000 }));
        };
        message.react("✅");
    }
};
