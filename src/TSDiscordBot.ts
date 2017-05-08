import { CommandoClient } from 'discord.js-commando';
import { MongoProvider } from './Providers/MongoDB';
import { Server } from './Server/Server';

import * as mongoose from 'mongoose';
import * as path from 'path';
import * as sqlite from 'sqlite';

const { mongoDb }: { mongoDb: string } = require('../settings.json');
(mongoose as any).Promise = global.Promise;

export class TSDiscordBot {
	private client: CommandoClient;
	private server: Server;

	public start(token: string): void {
		console.log('Starting bot...');
		this.client = new CommandoClient({
			owner: '117336043119706119',
			commandPrefix: '>',
			messageCacheLifetime: 30,
			messageSweepInterval: 60
		});

		this.client.on('ready', () => {
			console.log('The bot is ready!');
			console.log('Starting server...');
			this.server = new Server(3000, this.client);
			this.client.user.setGame('Use >help');
		});

		this.client.registry
			.registerGroups([
				['nsfw', 'Nsfw'],
				['util', 'Util'],
				['gifs', 'Gifs']
			])
			.registerDefaults()
			.registerCommandsIn(path.join(__dirname, 'Commands'));

		this.client.setProvider(
			mongoose.connect(mongoDb).then(() => new MongoProvider(mongoose.connection))
		).catch(console.error);

		this.client.login(token);
	}
}
