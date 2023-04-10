const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder,  Embed } = require("discord.js");

module.exports = {

    data:new SlashCommandBuilder()
    .setName("play")
    .setDescription("Lire une musique depuis youtube")
    .addStringOption(option => option.setName("nom").setDescription("Le nom de la musique recherché !").setRequired(true)),

    async execute(client, interaction) {

        const song_name = interaction.options.getString("nom")

       if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)

        if(!player) player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
        });

        const songs = await client.manager.search(song_name)

        player.connect();

        player.queue.add(songs.tracks[0])

        if(!player.playing) player.play()

        console.log(songs.tracks[0])

        const embed = new EmbedBuilder()
        .setColor(0x15e6ed)
        .setTitle('**Lecture de **' + songs.tracks[0].title)
        .setDescription('**Demandé par **' + interaction.member.user.username)
        .addFields({name: "Auteur", value: songs.tracks[0].author},
                   {name: "URL", value:songs.tracks[0].uri})
        .setThumbnail(songs.tracks[0].thumbnail)
        .setTimestamp();

       
        interaction.reply({embeds: [embed]})
    }
}