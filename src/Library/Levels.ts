import { Message, User } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { getRandomInt } from './Misc';

export interface LevelEntry {
	totalExperience: number;
	experience: number;
	level: number;
}

export interface LevelsMap {
	[userId: string]: LevelEntry;
}

export class Levels {
	public static onMessage(message: Message): void {
		if (!Levels.setup || message.author === Levels.client.user) return;

		const lastMessage: number = Levels.lastMessageMap.get(message.author) || -Infinity;
		if (Date.now() - lastMessage >= Levels.timeForExp) {
			Levels.lastMessageMap.set(message.author, Date.now());
			const levels: LevelsMap = Levels.client.provider.get(message.guild, 'levels') || {};
			const entry: LevelEntry = levels[message.author.id] || { totalExperience: 0, experience: 0, level: 0 };
			let totalExperience: number = entry.totalExperience;
			let experience: number = entry.experience;
			let level: number = entry.level;
			const expGain: number = getRandomInt(Levels.minExpPerMessage, Levels.maxExpPerMessage);
			totalExperience += expGain;
			experience += expGain;
			if (experience >= Levels.levelFunction(level)) {
				experience = experience - Levels.levelFunction(level);
				level++;
				message.channel.send(`GG ${message.author}, you just advanced to **level ${level}** !`);
			}
			levels[message.author.id] = { totalExperience, experience, level };
			Levels.client.provider.set(message.guild, 'levels', levels);

			//message.reply(`You just got ${expGain} experience, you have ${JSON.stringify(levels[message.author.id])}.`);
		}
		return;
	}

	public static setupListeners(client: CommandoClient): void {
		client.on('message', Levels.onMessage);
		Levels.client = client;
		Levels.setup = true;
	}

	private static lastMessageMap: Map<User, number> = new Map<User, number>();
	private static timeForExp: number = 1 * 1000;
	private static minExpPerMessage: number = 15;
	private static maxExpPerMessage: number = 25;
	private static client: CommandoClient;
	private static setup: boolean = false;

	private static levelFunction(level: number): number {
		return 5 * level * level + 50 * level + 100;
	}
}
