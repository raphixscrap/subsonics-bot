const { Client, GatewayIntentBits, Collection } = require("discord.js")
const { REST, Routes } = require("discord.js")
const fs = require("node:fs")
const config = require("./config.json")
const path = require("path")
const { Manager } = require("erela.js")

const client = new Client({
    intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers]
})

client.commands = new Collection()

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

        
        

		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(config.clientID, config.guildID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// Command Slash


// Client Event

client.once("ready", () => {

    console.log("Le meilleur groupe de musique est prêt !")
    client.manager.init(client.user.id);

    const commandManager = client.application.commands;

    if (!commandManager) {
            console.log('Command manager not available.');
            
    } else {

            commandManager.set([]);
    }
})

client.on("interactionCreate", (interaction) => {
    
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName)

    try {
        command.execute(client, interaction)
    } catch(error) {

        interaction.reply({content:"Erreur lors de l'éxécution de la commande !", ephemeral: true})
    }
})






const nodes = [
    {
      host: "lavalink.lexnet.cc",
      password: "lexn3tl@val!nk",
      port: 443,
      secure: true
    }
  ];

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
    console.log(`Node "${node.options.identifier}" connected.`)
})

// Emitted whenever a node encountered an error
client.manager.on("nodeError", (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
})


// THIS IS REQUIRED. Send raw events to Erela.js
client.on("raw", d => client.manager.updateVoiceState(d));
  

// Client Manager

client.login(config.token)
