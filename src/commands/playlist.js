const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder,  Embed } = require("discord.js");


module.exports = {

    data:new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Permet de lire une playlist de Youtube !")
    .addStringOption(option => option.setName("lien").setDescription("Le lien de la playlist !").setRequired(true)),

    async execute(client, interaction) {

        if(client.dictator == true ) {

            if((interaction.member._roles.includes("397725956598530050") == true | interaction.member.user.id == "486943594893017119")) {

                makeAction()
            } else {

                const embed = new EmbedBuilder()
                .setColor(0xff0303)
                .setTitle('Mode Dictateur')
                .setTimestamp();
                const song_show = {name: "Le mode dictateur est actif !", value: "Demande au grand roi !"}
                    
                embed.addFields(song_show)
                interaction.reply({embeds: [embed]})
            }
            
        } else {

            makeAction();
        }

        async function makeAction() {

        const song_name = interaction.options.getString("lien")

       if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)

        if(!player) { 
            
            player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            });

            player.connect();
        }

      


            var ytfps = require("ytfps")

            
            
            try {
                
                var playlist = await ytfps(song_name)

                const embed = await new EmbedBuilder()
                .setColor(0x15e6ed)
                .setTitle('**Lecture de la playlist : **' + playlist.title)
                .setDescription('**Demandé par **' + interaction.member.user.username)
                .addFields({name: "Auteur", value: playlist.author.name},
                          {name: "URL", value:playlist.url},
                          {name: "Nombre de videos", value:playlist.video_count + " vidéos"})
                .setThumbnail(playlist.thumbnail_url)
                .setTimestamp();
    
                try {

                    await interaction.reply({embeds: [embed]})
                } catch(error) {

                    console.log(error)
                }


                for(var song of playlist.videos) {
        
                    const song_finded = await client.manager.search(song.url)
                    await client.manager.players.get(interaction.guild.id).queue.add(song_finded.tracks[0])
    
                }

            } catch(err) {
                
                const embed = new EmbedBuilder()
                .setColor(0xff0303)
                .setTitle('Erreur : Playlist !')
                .setTimestamp();
                const song_show = {name: "Une erreur s'est produite ou la playlist n'existe pas !", value: "Est-tu sur du lien ?"}
                    
                embed.addFields(song_show)
                interaction.reply({embeds: [embed]})

                console.log(err)


            };


            if(playlist != null) {
    
                if(!player.playing) {
                
                
                    player.play()
                    
    
                    
                }
            }
            
           

       

      

        }
    }
}