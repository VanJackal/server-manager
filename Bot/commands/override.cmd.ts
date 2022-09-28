import {Interaction, SlashCommandBuilder} from "discord.js";
import {pulsePower, holdPower} from 'power-interface'
import {overrideGlobal,overrideService} from "../auto-off";

const {techs} = require('../config.json')

const GLOBAL_SRV = "!GLOBAL"

async function overridePower(interaction) {
    switch (interaction.options.getString("action")) {
        case 'pulse':
            await pulsePower();
            break
        case 'hold':
            await holdPower();
            break
    }
    await interaction.reply({content:"*Power Command Executed*", ephemeral:true})
}

async function overrideAuto(interaction) {
    const service = interaction.options.getString("service")
    const state = interaction.options.getBoolean("enabled")
    if (service === GLOBAL_SRV) {
        await overrideGlobal(state)
    } else {
        await overrideService(state,service)
    }

    interaction.reply(`Auto Off set to ${state} for '${service}'`)
}

export = {
    data: new SlashCommandBuilder()
        .setName("override")
        .setDescription("Override various limits. (Dev Only)")
        .addSubcommand(subcommand => subcommand
            .setName("power")
            .setDescription("Direct power interface control (Note: This gives zero fucks about service state)")
            .addStringOption(option => option
                .setName("action")
                .setDescription("press type")
                .setChoices(
                    {name: "Pulse", value:'pulse'},
                    {name: "Hold", value:'hold'}
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("auto-off")
            .setDescription("Enable/Disable auto shutdown for a service or globally")
            .addBooleanOption(option => option
                .setName("enabled")
                .setDescription("is enabled?")
            )
            .addStringOption(option => option
                .setName("service")
                .setDescription(`service to override, '${GLOBAL_SRV}' for global setting`)
            )
        ),
    async execute(interaction) {
        if (!techs.includes(interaction.user.id)){
            interaction.reply({content:"You do not have permission to do this", ephemeral:true})
        }
        switch (interaction.options.getSubcommand()) {
            case "power":
                await overridePower(interaction);
                break
            case "auto-off":
                await overrideAuto(interaction);
                break
        }
    }
}
