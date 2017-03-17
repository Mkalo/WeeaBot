import { Message, Client } from "discord.js";
import { Command } from "./Command";


interface CommandHandlerOptions {
    client: Client;
    prefix?: string;
}

export class CommandHandler {
    private client: Client;
    private prefix: string = "!";
    private listening: boolean = false;
    private commandsMap: Map<string, Command> = new Map<string, Command>();

    constructor(options: CommandHandlerOptions) {
        this.client = options.client;
        
        if (!!options.prefix) {
            this.prefix = options.prefix; 
        }
    }

    private parseMessage(message: Message): void {
        if (!message.content.startsWith(this.prefix)) {
            return;
        }
        const msg: string = message.content.substr(this.prefix.length);

        const firstSpace = msg.indexOf(' ');
        let commandName: string;
        if (firstSpace != -1) {
            commandName = msg.substr(0, firstSpace);
        } else {
            commandName = msg;
        }

        const command: Command = this.commandsMap.get(commandName);
        if (!!command) {
            command.execute(this.client, message, msg.substr(firstSpace + 1));
        }
    }

    public addCommand(command: Command): void {
        this.commandsMap.set(command.getName(), command);
    }

    public listen(): void {
        if (!this.listening) {
            this.client.on("message", (message) => {
                this.parseMessage(message);
            });
            this.listening = true;
        }
    }
}