function playProxy(message, guild, song) {
    const { queue } = require("../index");
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.songs = [];
        queue.delete(guild.id);
        return message.guild.me.voice.channel.leave();
    };
    const ytdl = require("discord-ytdl-core");
    let encoderArgs = [`aresample=48000`];
    let encoderArgsString = "";
    if (serverQueue.nightcore == true) encoderArgs.push(`asetrate=${serverQueue.asetrate}`);
    if (serverQueue.speed != 1) encoderArgs.push(`atempo=${serverQueue.speed}`);
    encoderArgs.push(`atrim=start=${serverQueue.seek/1000}`);
    if (serverQueue.bass != 0) encoderArgs.push(`bass=g=${serverQueue.bass}`);
    if (serverQueue.pitch != 1) encoderArgs.push(`rubberband=pitch=${serverQueue.pitch}`);
    if (serverQueue.eightd != 0) encoderArgs.push(`apulsator=hz=${serverQueue.eightd}`);
    encoderArgsString = encoderArgs.join(", ");
    encoderArgs = ["-af", `${encoderArgsString}`];
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync("././config.json", "utf-8"));
    const HttpsProxyAgent = require("https-proxy-agent");
    const proxy = config.PROXY;
    const agent = HttpsProxyAgent(proxy);
    serverQueue.stream = ytdl(song.url, {
        requestOptions: {
            headers: {
                cookie: config.COOKIES,
                "x-youtube-identity-token": config.YTIDTOKEN
            },
            agent
        },
        filter: "audioonly",
        opusEncoded: true,
        dlChunkSize: 0,
        highWaterMark: 1<<25,
        encoderArgs: encoderArgs
    });
    const dispatcher = serverQueue.connection.play(serverQueue.stream, {
        type: "opus"
    }).on("finish", () => {
        serverQueue.stream.destroy();
        if (serverQueue.filterCmd == false) {
            if (!serverQueue.loop) serverQueue.songs.shift();
            serverQueue.curtime = 0;
            serverQueue.seek = 0;
        };
        serverQueue.filterCmd = false;
        playProxy(message, guild, serverQueue.songs[0]);
    }).on("error", (error) => {
        if (error.statusCode == "429" || error.statusCode == "403") {
            const { play } = require("./play");
            return play(message, guild, serverQueue.songs[0]);
        };
        serverQueue.stream.destroy();
        serverQueue.songs = [];
        queue.delete(guild.id);
        console.log(error);
        return message.react("❌");
    });
    dispatcher.setVolume(0.25);
    const npembed = require("../embeds/npembed");
    npembed.execute(message);
};

return module.exports.playProxy = playProxy;
