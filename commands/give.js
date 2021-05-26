module.exports = {
    name: "give",
    execute(message, args) {
        const db = require("quick.db");
        const bankCheck = db.get(`guild_${message.guild.id}_bank_${message.author.id}`) || 0;
        if(bankCheck == 0) {
            message.channel.send("You don't have a bank, please create one.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        const user = message.mentions.users.first();
        if(!user) {
            message.channel.send("Invalid user.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        if(user.id == message.author.id) {
            message.channel.send("You cannot give to yourself.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        const balCheck = db.get(`guild_${message.guild.id}_bal_${message.author.id}`);
        if(args[1] > balCheck || args[1] < 0 || isNaN(args[1])) {
            message.channel.send("Invalid amount.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        db.add(`guild_${message.guild.id}_bal_${user.id}`, args[1]);
        db.subtract(`guild_${message.guild.id}_bal_${message.author.id}`, args[1]);
        message.channel.send(`${message.author} has given $${args[1]} to ${user}`);
        return message.react("✅");
    }
};
