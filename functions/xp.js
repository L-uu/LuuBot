function xp(message) {
    const db = require("quick.db");
    const randomNumber = Math.floor(Math.random() * 10) + 15;
    db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber);
    db.add(`guild_${message.guild.id}_xptotal_${message.author.id}`, randomNumber);
    var level = db.get(`guild_${message.guild.id}_level_${message.author.id}`) || 1;
    var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`);
    var xpNeeded = level * 500;
    if (xpNeeded < xp) {
        var newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1);
        db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded);
        message.channel.send(`${message.author} has just leveled up to level ${newLevel}`)
            .then(msg => msg.delete({ timeout: 5000 }));
    };
};

return module.exports.xp = xp;
