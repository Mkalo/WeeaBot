import { Client } from "discord.js";
import { CommandHandler } from "./Utils/CommandHandler";
import { NekoCommand } from "./Commands/NekoCommand";

export class TSDiscordBot {
    private client: Client;
    private commandHandler: CommandHandler;

    public start(token: string) {
        console.log("Starting bot.");   
        this.client = new Client();
        
        this.client.on("ready", () => {
            console.log("The bot is ready!");
        });

        this.commandHandler = new CommandHandler({
            client: this.client,
            prefix: "!"
        });
        this.commandHandler.addCommand(new NekoCommand({name: "neko"}));
        this.commandHandler.listen();
        
        this.client.login(token);
    }
}
