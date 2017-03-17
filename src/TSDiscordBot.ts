import { CommandoClient } from 'discord.js-commando';
import * as path from 'path';

export class TSDiscordBot {
    private client: CommandoClient;

    public start(token: string) {
        console.log("Starting bot.");   
        this.client = new CommandoClient({
            owner: '117336043119706119',
            commandPrefix: "!",
            messageCacheLifetime: 30,
            messageSweepInterval: 60
        });
        
        this.client.on("ready", () => {
            console.log("The bot is ready!");
        });

        this.client.registry
	        .registerGroups([
		        ['nsfw', 'Nsfw'],
                ['util', 'Util']
            ])
            .registerDefaults()
            .registerCommandsIn(path.join(__dirname, 'Commands'));
        
        this.client.login(token);
    }
}
