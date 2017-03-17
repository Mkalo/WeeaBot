import { Client, Message } from "discord.js";

interface CommandOptions {
    name: string;
    description?: string;
}

export abstract class Command {
    private description: string = "This command has no description.";
    private name: string;
    
    constructor(options: CommandOptions) {
        this.name = options.name;

        if (!!options.description) {
            this.description = options.description;
        }
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public abstract execute(client: Client, message: Message, argument: string);
}