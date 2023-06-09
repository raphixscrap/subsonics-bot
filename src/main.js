if ("ENV" in process.env) {
    if(process.env.ENV == "TEST") {
      process.exit(0)
  
    }
  
} 

const log = require("./sublog.js")
var membersVoices = new Map()

const nodes = [
    {
      host: "narco.buses.rocks",
      password: "glasshost1984",
      port: 2269,
      secure: false
    }
  ];

function startDiscordBot() {



    const { Client, GatewayIntentBits, Collection, ActivityType } = require("discord.js")
    const { REST, Routes } = require("discord.js")
    const fs = require("node:fs")
    const config = require("./config.json")
    const path = require("path")
    const { Manager  } = require("erela.js")


    const client = new Client({
        intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers],
    })


    client.commands = new Collection()
    client.dictator = false;

    const commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(__dirname , 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command)
        commands.push(command.data.toJSON());
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(config.token);

    // and deploy your commands!
    (async () => {
        try {

            
            

            log.bot(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationGuildCommands(config.clientID, config.guildID),
                { body: commands },
            );

            log.bot(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            log.bot.error(error);
        }
    })();

    // Command Slash

   
    // Client Event

    client.once("ready", () => {

        log.bot("Le meilleur groupe de musique est prêt !")
        client.manager.init(client.user.id);

        const commandManager = client.application.commands;

        if (!commandManager) {
                log.bot('Command manager not available.');
                
        } else {

                commandManager.set([]);
        }
    })

    client.on("voiceStateUpdate", (oldMember, newMember) => {

        membersVoices.set(newMember.id, newMember.channelId)

        let player = client.manager.players.get(oldMember.guild.id)

        if(player) {

            client.channels.fetch(player.options.voiceChannel).then(channel => {

                if(channel.members.size <= 1) {

                    player.destroy()
                }
            })
        }
    })

    client.on("interactionCreate", (interaction) => {
        
        if(!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName)

        try {
           
            log.bot(interaction.member.displayName + "-> /" + interaction.commandName)
            command.execute(client, interaction)
        } catch(error) {

            interaction.reply({content:"Erreur lors de l'éxécution de la commande !", ephemeral: true})
        }
    })






    

    client.manager = new Manager({
        // The nodes to connect to, optional if using default lavalink options
        nodes,
        // Method to send voice data to Discord
        send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
        if (guild) guild.shard.send(payload);
        }
    });

    // Emitted whenever a node connects
    client.manager.on("nodeConnect", node => {
        log.bot(`Node "${node.options.identifier}" connected.`)
    })

    // Emitted whenever a node encountered an error
    client.manager.on("nodeError", (node, error) => {
        log.bot(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
    })


    // THIS IS REQUIRED. Send raw events to Erela.js
    client.on("raw", d => client.manager.updateVoiceState(d));
    

    // Client Manager

    startServer(client)


    client.login(config.token)


    
}

function startServer(client) {

    const express = require('express');
    const app = express();
    const http = require('http');
    const server = http.createServer(app);
    var cookieParser = require('cookie-parser')
    const { Server } = require("socket.io");
    const io = new Server(server);
    const uuid = require("uuid")
    const fs = require("fs")
    const path = require("path")

    app.use(express.static(__dirname + path.sep + 'error'))
    app.use(express.static(__dirname + path.sep + 'close'))

    if(!fs.existsSync(__dirname + path.sep + "tokens.json")) {

        fs.writeFileSync(__dirname + path.sep + "tokens.json", JSON.stringify({}, null, 2))

    }

    var link = null
    var discordlink = null

    if(process.env.DEV == "true") {

        log.server("DEV MOD ENABLED")
        link = "http://localhost:4000" //DEV
        discordlink = "https://discord.com/api/oauth2/authorize?client_id=1094727789682380922&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fredirect&response_type=code&scope=identify%20guilds%20guilds.members.read" //DEV
    } else {
        discordlink = "https://discord.com/api/oauth2/authorize?client_id=1094727789682380922&redirect_uri=https%3A%2F%2Fsubsonics.raphix.fr%2Fredirect&response_type=code&scope=identify%20guilds%20guilds.members.read" //OFFICIEL
        link = "https://subsonics.raphix.fr"
    }



    var authTokenWait = new Map()
    var users = new Map()
    var onlineNumber = 0;


    

    function reimportUser() {
        

        const tokens = require(__dirname + path.sep + "tokens.json")

        users = new Map()
        for(var user in tokens) {
            
            users.set(user , tokens[user])
        }
        
        return users

    }

  
    app.use(cookieParser())


    io.on('connection', (socket) => {
        log.server("Nouvelle Connexion - Client : " + socket.id)
        onlineNumber += 1
        actualize()

        socket.on('disconnect', () => {
            log.server("Déconnexion - Client : " + socket.id);
            onlineNumber -= 1
            actualize()
        });

        socket.on("find", (token, value) => {

            async function find() {

                const searchList = await client.manager.search(value)
                await socket.emit("findResult", searchList)
          
            }
     

            if(users.has(token)) {
              
                log.server("Recherche avec les mots clés : " + value + " de musique de " + users.get(token).username + "#" +  users.get(token).discriminator)

                find()
                
            }   


        })

        socket.on("addQueue", (token, url) => {

            async function play() {
                if(users.has(token)) {
                  
                    let player = client.manager.players.get("137291455336022018")

                    var voiceChannel = "664355808250953739"
          

                    if(membersVoices.has(users.get(token).id) &&  membersVoices.get(users.get(token).id) != null) {

                        voiceChannel = membersVoices.get(users.get(token).id)

                    }
                      
                     if(!player) { 
                    
                        player = client.manager.create({
                        guild: "137291455336022018",
                        voiceChannel: voiceChannel,
                        textChannel: voiceChannel,
                        });
            
                        player.connect();
                    }
                    
             
                    const songtrack = await client.manager.search(url)
                    player.queue.add(songtrack.tracks[0])
              

                    log.server("Lecture / Ajout du titre : " + songtrack.tracks[0].title + " de musique de " + users.get(token).username + "#" +  users.get(token).discriminator)

                    if(!player.playing) {
    
                       player.play()
                    }
    
                }


                actualize()
            }

            play()
            
        })

        socket.on("authNeedLogin", () => {

           log.server("Discord Auth : Demande Token de " + socket.id)
           const token = uuid.v4().toString()

           authTokenWait.set(token, socket)

           socket.emit("authOpenLink", link + "/" + token)

           app.get("/" + token, (req, res) => {

            res.cookie("authLoginFollow", token)
            log.server("Discord Auth : Redirection vers le service Discord pour " + socket.id)
            res.redirect(discordlink)

           })
            
           //socket.emit("authFailed")

        })

        socket.on("authByToken", (token) => {

            var answer = false
          
            if(users.has(token)) {
                answer = true
               
                log.server("Connexion au serveur par Token - SOCKET_ID : " + socket.id + " - DISCORD_USER : " + users.get(token).username + "#" +  users.get(token).discriminator)
                actualize()
            }

            socket.emit("authByTokenAnswer", answer, token)
        })

        socket.on("getState", (token) => {

                const data = {
                    "username":users.get(token).username + "#" +  users.get(token).discriminator,
                    "avatar": users.get(token).avatar,
                    "id": users.get(token).id,
                }

               actualize()

               socket.emit("updateState", data)

        

           
        })

        socket.on("play", (token) => {
            if(users.has(token)) {
               
                log.server("Mise en Play / Pause demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)


                let player = client.manager.players.get("137291455336022018")

                if(player && player.playing == true && player.paused == false) {

                    player.pause(true)

                } else if(player && player.playing == false && player.paused == true) {
                
                    player.pause(false)
                }

                actualize()
            } else {
                socket.emit("authFailed")

            }

        })

        process.on("discordDoing", () => {
            log.server("Discord BOT - Doing an action need actualisation !")
            actualize()
        })

        socket.on("seek", (token, pos) => {
            if(users.has(token)) {

                
                log.server("Avancement demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                let player = client.manager.players.get("137291455336022018")

                if(player) {

                    player.seek(pos)
                }

                actualize()
            } else {

                socket.emit("authFailed")
            }

        })

        socket.on("volume", (token, pos) => {
            if(users.has(token)) {

                
                log.server("Changement de volume demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                let player = client.manager.players.get("137291455336022018")

                if(player) {

                    player.setVolume(pos)
                }

                actualize()
            } else {

                socket.emit("authFailed")
            }

        })

        socket.on("listClear", (token) => {
            if(users.has(token)) {

                
                log.server("Clear liste demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                let player = client.manager.players.get("137291455336022018")

                if(player) {

                    player.queue.clear()
                }

                actualize()
            } else {

                socket.emit("authFailed")
            }

        })

        socket.on("report", (token, report) => {
            if(users.has(token)) {

                const { EmbedBuilder } = require("discord.js")
                
                log.server("Bug report demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)
                var embed = null

                if(report.type == "Bug") {
                    embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('Bug report de ' +  users.get(token).username + "#" +  users.get(token).discriminator)
                    .setDescription('**Version **' + report.version)
                    .addFields({name: "Description", value: report.text})
                    .setTimestamp();
    

                } else {
                    embed = new EmbedBuilder()
                    .setColor(0x0000ff)
                    .setTitle('Suggestion de ' +  users.get(token).username + "#" +  users.get(token).discriminator)
                    .setDescription('**Version **' + report.version)
                    .addFields({name: "Description", value: report.text})
                    .setTimestamp();
    
    

                }

                
                sendReport()
                async function sendReport() {
                    const channel = await client.channels.fetch('1102177962817749033')

                    channel.send({embeds: [embed]})
                    channel.send({content: "<@486943594893017119>"})
               
                }
                socket.emit("reportAns", true)
                actualize()
            } else {

                socket.emit("authFailed")
            }

        })




        socket.on("deleteQueue", (token, identifier) => {

            if(users.has(token)) {

                let player = client.manager.players.get("137291455336022018")

                if(player) {

                    log.server("Supression (n°" + identifier + ") d'un morceau demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                    player.queue.remove(identifier)


                }
               
                actualize()
            } else {
                socket.emit("authFailed")

            }

        })

        socket.on("moveQueue", (token, identifier) => {

            if(users.has(token)) {

                let player = client.manager.players.get("137291455336022018")

                if(player) {

                    log.server("Déplacement (n°" + identifier + ") d'un morceau demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                    
                    let elementToMove = player.queue[identifier]; 

                    player.queue.remove(identifier)
                    player.queue.unshift(elementToMove);
                   

                }
               
                actualize()
            } else {
                socket.emit("authFailed")

            }

        })

        socket.on("backward", (token) => {

            if(users.has(token)) {
   
                log.server("Retour arrière demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                let player = client.manager.players.get("137291455336022018")

                if(player && player.queue.previous) {

                    player.play(player.queue.previous)

                } else if(player && player.queue.current) {

                  
                    player.play(player.queue.current)

                } 

                actualize()
            } else {
                socket.emit("authFailed")

            }


        })

        socket.on("forward", (token) => {

            if(users.has(token)) {
               
                log.server("Skip demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                let player = client.manager.players.get("137291455336022018")

                if(player && player.queue.length != 0) {

                    player.stop()
                    

                } else if(player && player.queue.current) {

                   
                    player.play(player.queue.current)

                } 

                actualize()
            } else {
                socket.emit("authFailed")

            }


        })

        socket.on("loop", (token) => {

            if(users.has(token)) {
                
                let player = client.manager.players.get("137291455336022018")

                log.server("Looping demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                if(player) {

                    if(player.queueRepeat == true) {
                        player.setQueueRepeat(false)

                    } else {
                        player.setQueueRepeat(true)

                    }
                    
                }    

                actualize()
            } else {
                socket.emit("authFailed")

            }


        })

        socket.on("exit", (token) => {

            if(users.has(token)) {
               
                log.server("Skip demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                let player = client.manager.players.get("137291455336022018")

                if(player) {

                    player.destroy()
                }

                actualize()
            } else {
                socket.emit("authFailed")

            }


        })

        socket.on("restart", (token) => {

            if(users.has(token)) {
               
                log.server("Restart demandé par " + users.get(token).username + "#" +  users.get(token).discriminator)

                let player = client.manager.players.get("137291455336022018")

                if(player) {

                    player.destroy()
                }

    
                  
                  client.manager.createNode(nodes)

                actualize()
            } else {
                socket.emit("authFailed")

            }


        })

      
    
    });


    client.manager.on("playerCreate", () => {
        log.server("Player : Player Created -> Actualize all client !")
        actualize()

    })

    client.manager.on("playerDestroy", () => {
        log.server("Player : Player Destroyed -> Actualize all client !")
        actualize("end")

    })

    client.manager.on("trackStart", () => {

        log.server("Player : New Track Start-> Actualize all client !")
        
        
        let player = client.manager.players.get("137291455336022018")

        if(player) {

            player.seek(0)
        }

        actualize()

    })

    client.manager.on("queueEnd", () => {
   
            log.server("Player : End Queue -> Actualize all client !")
            actualize()

    
      

    })

    

    function actualize(action) {

        let player = client.manager.players.get("137291455336022018")


        const data = {
            "onlineNumber":onlineNumber,
            "playing": 0,
            "current":null,
            "isOnline": false,
            "queue": null,
            "loop": false,
            "durationNow": null,
            "durationAll": null,
            "volume": null
        }

        if(player) {

            const { ActivityType } = require("discord.js")

            client.user.setPresence({
                activities: [{ name: `rien pour le moment`, type: ActivityType.Listening }],
                status: 'dnd',
            });

            data["current"] = player.queue.current
      
            if(player.queueRepeat == true) {

                data["loop"] = true
            } 

            data["volume"] = player.volume * 10
            

            if(player.queue.current) {
                data["durationNow"] = player.position
                data["durationAll"] = player.queue.current.duration

                client.user.setPresence({
                    activities: [{ name: player.queue.current.title, type: ActivityType.Listening }],
                    status: 'dnd',
                });

            } 
            
          

            if(player.playing == true && player.paused == false) {

                data["playing"] = 1
            } else {
                data["playing"] = 0

            }

            data["queue"] = player.queue;
            
            if(player.playing == true) {
                
                 log.server("Musique : Musique actuelle : " + player.queue.current.title)
            }
               
            data["isOnline"] = true
           
        }  

        log.server("Actualisation Client : Online Number : "  + data.onlineNumber + " - PlayingState : " + data.playing + " - Current : " + data.current + " - Player : " + player)
      

        
        if(action == "end") {

            data["current"] = null;
            data["isOnline"] = false
        }

        try {

            io.sockets.emit("actualize", data)
        } catch(error) {

            log.server("ERROR OF ACT")
        }

        

      
    }
   

    app.get("/redirect", (req, res) => {
    

        let token = req.cookies.authLoginFollow

        if(token != null) {

            if(authTokenWait.has(token) == true) {
               
                const socket = authTokenWait.get(token)
               
                if(req.query.error) {
                    socket.emit("authFailed")
                    res.sendFile(__dirname + path.sep + "error" + path.sep + "error.html")
                    log.server("Discord Auth : Erreur - Refus de connexion chez le service Discord : Token de Connexion : " + token + " associé à Client ID : " + socket.id)

                } else {

               
                const code = req.query.code
    

                log.server("Discord Auth : Récupération du service Discord : Token de Connexion : " + token + " associé à Client ID : " + socket.id)

                if(code) {
                    
                    try {
                        log.server("Discord Auth : REQUESTING DATA - TOKEN : " + token + " - DISCORD_CODE : " + code)

                        const params = new URLSearchParams();
                        params.append('client_id', "1094727789682380922");
                        params.append('client_secret', "uwtyPOPKCgw6ciBs20qiJ7LJrW9Ziclo");
                        params.append('grant_type', 'authorization_code');
                        params.append('code', code);
                        params.append('redirect_uri',  link + "/redirect");
                        params.append('scope', 'identify guilds');

                        fetch('https://discord.com/api/oauth2/token', {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }, body : params
                        }).then(resp => resp.json()).then(resp => createIdentity(resp, token, socket)).catch(error => log.server.error(error)) 



                        res.clearCookie("authLoginFollow")
                        res.sendFile(__dirname + path.sep + "close" + path.sep + "close.html")
    

                    } catch(error) {

                        console.log(error)
                    }

                } else {
                    res.sendFile(__dirname + path.sep + "error" + path.sep + "error.html")

                }   

               
            }

            } else {
                res.sendFile(__dirname + path.sep + "error" + path.sep + "error.html")

            } 

        } else {

            res.sendFile(__dirname + path.sep + "error" + path.sep + "error.html")
            
        }

       
    })

    function createIdentity(response, token, socket) {

  
        log.server("Discord Auth : REQUESTING DATA - TOKEN : " + token + " - DISCORD_ACCESS_TOKEN : " + response.access_token)

        fetch('https://discord.com/api/users/@me/guilds/137291455336022018/member', {
            headers: {
                authorization: `${response.token_type} ${response.access_token}`,
            },
        }).then(resp => resp.json()).then(resp => checkIdentity(resp, token, socket, response)).catch(error => log.server.error(error)) 
       
    }

    async function checkIdentity(servers, token, socket, creditentials) {

        var checked = true

        if(servers.message) {

            checked = false
            console.log("Discord Auth - DENIED - NOT IN SERVER - Token : " + token)
        } else {

            for(var role of servers.roles) {

                if(role == "397725552968204288") {

                    checked = true

                }
                
                if(role == "172437570905571328") {

                    checked = true
                }
                
                if(role == "226744358567804928") {
         

                    checked = true
            
                } 
                
                if(role == "220649460059996163") {
         

                    checked = true
            
                }

            }

        }

        if(checked == true) {
            
            console.log("Discord Auth - ACCESS GRANTED - Token : " + token)
            fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${creditentials.token_type} ${creditentials.access_token}`,
                },
            }).then(resp => resp.json()).then(resp => addIdentity(resp, token, socket)).catch(error => log.server.error(error)) 

        } else {
            console.log("Discord Auth - DENIED - DONT HAVE RANK - Token : " + token)
            socket.emit("checkFailed")
        }

       

    }

    async function addIdentity(response, token, socket) {
        
     
     
        log.server("Discord Auth : [IDENTITE] : Nouvelle identité - SOCKET_ID : " + socket.id + " - DISCORD_USER : " + response.username + "#" + response.discriminator)
        

        const tokens = require(__dirname + path.sep + "tokens.json")

        tokens[token] = response
        users.set(token, response)
        
        await fs.writeFile(__dirname + path.sep + "tokens.json", JSON.stringify(tokens, null, 2), () => {
                
    
                reimportUser()
                socket.emit("successLogin", token)
                actualize()
                authTokenWait.delete(token)

        })


    }


        

    
    var port = 4000;

    server.listen(port, () => {
        log.server("Ecoute sur le PORT : " + port)
    });

  
}
  
function handleFatalError(error) {
    log.bot.error('Erreur fatale :', error);
    console.log(error)
    client = null
    
  
}
  
process.on('uncaughtException', handleFatalError);
  
startDiscordBot();

