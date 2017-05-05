import { TSDiscordBot } from './TSDiscordBot';
const { token }: { token: string } = require('../settings.json');

const bot: TSDiscordBot = new TSDiscordBot();
bot.start(token);
