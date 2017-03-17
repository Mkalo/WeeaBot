import { Client, Message } from "discord.js";
import { Command } from "../Utils/Command";
import * as request from "request";

export class NekoCommand extends Command {
    public execute(client: Client, message: Message, argument: string) {
        request("http://catgirls.brussell98.tk/nsfw/", (err, response, body) => {
            const regex: RegExp = new RegExp(/ src="(.+?)"/m);
            const result: RegExpExecArray = regex.exec(body);
            if (!!result) {
                message.channel.sendMessage("http://catgirls.brussell98.tk" + result[1]);
            } else {
                message.channel.sendMessage("Sorry an error occured, try again later!");
            }
        });
    }
}