module.exports = {
    execute(message) {
        const { queue } = require("../index");
        const serverQueue = queue.get(message.guild.id);
        const Discord = require("discord.js");
        const pembed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor("Paused")
            .setTitle(`${serverQueue.songs[0].title}`)
            .setImage(`${serverQueue.songs[0].thumbnail}`);
        return message.channel.send(pembed)
            .then(msg => msg.delete({ timeout: 5000 }));
    }
};
