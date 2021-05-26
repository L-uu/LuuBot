module.exports = {
    name: "claim",
    execute(message) {
        const db = require("quick.db");
        const bankCheck = db.get(`guild_${message.guild.id}_bank_${message.author.id}`) || 0;
        if(bankCheck == 0) {
            message.channel.send("You don't have a bank, please create one.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        const now = new Date();
        const lastClaimed = db.get(`guild_${message.guild.id}_lastclaimed_${message.author.id}`);
        if(!lastClaimed) {
            db.add(`guild_${message.guild.id}_lastclaimed_${message.author.id}`, now.getMinutes());
        };
        if(now.getMinutes() > lastClaimed + 10 || !lastClaimed) {
            db.add(`guild_${message.guild.id}_bal_${message.author.id}`, 100);
            message.channel.send("Successfully claimed $100, come back in 10 minutes.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("✅");
        } else {
            message.channel.send("This command can only be used once every 10 minutes.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
    }
};
