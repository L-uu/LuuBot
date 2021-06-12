module.exports = {
    execute(message, song) {
        const Discord = require("discord.js");
        const qembed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor("Added to queue")
            .setTitle(`${song.title}`)
            .setImage(`${song.thumbnail}`);
        return message.channel.send(qembed)
            .then(msg => msg.delete({ timeout: 5000 }));
    }
};
