import { TSDiscordBot } from "./TSDiscordBot";
const { token }: { token: string } = require('./settings.json');

const Bot = new TSDiscordBot();
Bot.start(token);
