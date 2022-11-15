import * as fs from "fs";
import * as path from "path";
const {Client, Collection, GatewayIntentBits} = require('discord.js')
import {logger} from 'logging'
import {EmbedBuilder, Routes} from "discord.js";
import {Logs} from "./commands/Colours";
import {Service} from 'db'
require("./auto-off")

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
];
const client = new Client({intents:intents});

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cmd.js'))
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath);
    client.commands.set(command.data.name,command);
}

client.on('interactionCreate', async (interaction) => {
    if(interaction.isAutocomplete()) return
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction)
    } catch (error) {
        logger.error(error);
        logger.error(JSON.stringify(error))
        const embed = new EmbedBuilder()
            .setColor(Logs.ERROR)
            .addFields({name:"Error", value:`Error in command execution, see log channel for details`})
            .setTimestamp()
        await interaction.channel.send({embeds:[embed]})
    }
})


let services;
const servicesP = Service.find({},{serviceId:1}).then((res) => {
    services = res.map((service) => {
        return {name:service.serviceId, value:service.serviceId}
    })
    logger.info("Initialized service list")
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isAutocomplete()) return

    const focusedOption = interaction.options.getFocused(true)
    if(focusedOption.name === 'service') {
        if(!services) await servicesP;
        await interaction.respond(services.filter((choice) => {
            return choice.name.startsWith(focusedOption.value)
        }))

    }
})



client.login(process.env.TOKEN);
