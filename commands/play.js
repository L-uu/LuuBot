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

        const ytsr = require("youtube-sr");
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$0") : "";
        const searchString = args.slice(0).join(" ");
        try {
            if (url.match(/^https?:\/\/www.youtube.com\/playlist(.*)$/)) {
                const id = url.substr(38);
                const playlist = await ytsr.YouTube.getPlaylist(id);
                for (const videolist of Object.values(playlist.videos)) {
                    const video = await ytsr.YouTube.searchOne(`https://www.youtube.com/watch?v=${videolist.id}`);
                    await handleVideo(video, message, true);
                };
            }
            else if (url.match(/^https?:\/\/youtube.com\/playlist(.*)$/)) {
                const id = url.substr(34);
                const playlist = await ytsr.YouTube.getPlaylist(id);
                for (const videolist of Object.values(playlist.videos)) {
                    const video = await ytsr.YouTube.searchOne(`https://www.youtube.com/watch?v=${videolist.id}`);
                    await handleVideo(video, message, true);
                };
            }
            else if (url.match(/^https?:\/\/open.spotify.com\/playlist(.*)$/)) {
                const fs = require("fs");
                const config = JSON.parse(fs.readFileSync("././config.json", "utf-8"));
                const SpotifyWebApi = require("spotify-web-api-node");
                const spotifyApi = new SpotifyWebApi({
                    clientId: `${config.CLIENTID}`,
                    clientSecret: `${config.CLIENTSECRET}`
                });
                spotifyApi.setAccessToken(`${config.ACCESSTOKEN}`);
                const id = url.substr(34, 22);
                spotifyApi.getPlaylist(id)
                    .then(async function(data) {
                        for (let i = 0; i < data.body.tracks.items.length; i++) {
                            var video = await ytsr.YouTube.searchOne(`${data.body.tracks.items[i].track.artists[0].name} ${data.body.tracks.items[i].track.name} audio`);
                            await handleVideo(video, message, true);
                        };
                    })
                    .catch(() => {
                        const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                        const url = "https://accounts.spotify.com/api/token";
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", url);
                        xhr.setRequestHeader("Authorization", `Basic ${config.BASE64AUTH}`);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                const newToken = xhr.responseText.slice(17, 172) // Token is 155 characters long.
                                const replaceJSONProperty = require("replace-json-property");
                                replaceJSONProperty.replace("./config.json", "ACCESSTOKEN", newToken);
                                spotifyApi.setAccessToken(`${newToken}`);
                                spotifyApi.getPlaylist(id)
                                    .then(async function(data) {
                                        for (let i = 0; i < data.body.tracks.items.length; i++) {
                                            var video = await ytsr.YouTube.searchOne(`${data.body.tracks.items[i].track.artists[0].name} ${data.body.tracks.items[i].track.name} audio`);
                                            await handleVideo(video, message, true);
                                        };
                                    });
                            };
                        };
                        const data = `grant_type=refresh_token&refresh_token=${config.REFRESHTOKEN}`;
                        xhr.send(data);
                    })
            }
            else {
                var video = await ytsr.YouTube.searchOne(`${searchString} audio`);
            };
            handleVideo(video, message);
        } catch (error) {
            message.channel.send(`${error}`);
            return message.react("❌");
        };

        async function handleVideo(video, message, playlist = false) {
            const { queue } = require("../index");
            const serverQueue = queue.get(message.guild.id);
            try {
                var song = {
                    url: `https://www.youtube.com/watch?v=${video.id}`,
                    title: video.title.toString(),
                    thumbnail: video.thumbnail.url.toString(),
                    requester: message.author.username
                };
            } catch {
                return;
            };
            if (!serverQueue) {
                const queueConstruct = {
                    songs: [],
                    playing: true,
                    connection: null,
                    stream: null,
                    loop: false,
                    filterCmd: false,
                    nightcore: false,
                    asetrate: 48000,
                    bass: 0,
                    speed: 1,
                    pitch: 1,
                    curtime: 0,
                    seek: 0
                };
                queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);
                try {
                    try {
                        var connection = await message.member.voice.channel.join();
                    } catch {
                        message.channel.send("I cannot join this voice channel.")
                            .then(msg => msg.delete({ timeout: 5000 }));
                        queue.delete(message.guild.id);
                        return message.react("❌");
                    };
                    connection.voice.setSelfDeaf(true);
                    queueConstruct.connection = connection;
                    const { play } = require("../functions/play");
                    play(message, message.guild, queueConstruct.songs[0]);
                    return message.react("✅");
                } catch (error) {
                    message.channel.send(`${error}`);
                    return message.react("❌");
                };
            } else {
                const dcCheck = message.guild.me.voice.channel;
                if (!dcCheck) {
                    serverQueue.stream.destroy();
                    var connection = await message.member.voice.channel.join();
                    serverQueue.connection = connection;
                    connection.voice.setSelfDeaf(true);
                    serverQueue.loop = false;
                    serverQueue.nightcore = false;
                    serverQueue.asetrate = 48000;
                    serverQueue.bass = 0;
                    serverQueue.speed = 1;
                    serverQueue.pitch = 1;
                    serverQueue.curtime = 0;
                    serverQueue.seek = 0;
                    const { play } = require("../functions/play");
                    play(message, message.guild, serverQueue.songs[0]);
                };
                serverQueue.songs.push(song);
                if (playlist) return;
                const qembed = require("../embeds/qembed");
                qembed.execute(message, song);
                return message.react("✅");
            };
        };
    }
};
