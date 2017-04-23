import { CommandoClient, SQLiteProvider } from 'discord.js-commando';
import * as path from 'path';
import * as sqlite from 'sqlite';

export class TSDiscordBot {
	private client: CommandoClient;

	public start(token: string): void {
		console.log('Starting bot.');
		this.client = new CommandoClient({
			owner: '117336043119706119',
			commandPrefix: '>',
			messageCacheLifetime: 30,
			messageSweepInterval: 60
		});

		this.client.on('ready', () => {
			console.log('The bot is ready!');
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
			sqlite.open(path.join(__dirname, '../settings.sqlite3')).then((db: any) => new SQLiteProvider(db))
		).catch(console.error);
		this.client.login(token);
	}
}
