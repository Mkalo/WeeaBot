import { Guild, Message, User } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { getRandomInt } from './Misc';

export interface LevelEntry {
	totalExperience: number;
	experience: number;
	experienceNext: number;
	level: number;
}

export interface LevelsMap {
	[userId: string]: LevelEntry;
}

export class Levels {
	public static onMessage(message: Message): void {
		if (!Levels.setup || message.author === Levels.client.user) return;

		if (!Levels.lastMessageMap.has(message.guild)) {
			Levels.lastMessageMap.set(message.guild, new Map<User, number>());
		}
		const guildLastMessageMap: Map<User, number> = Levels.lastMessageMap.get(message.guild);
		const lastMessage: number = guildLastMessageMap.get(message.author) || -Infinity;
		if (Date.now() - lastMessage >= Levels.timeForExp) {
			guildLastMessageMap.set(message.author, Date.now());
			const levels: LevelsMap = Levels.client.provider.get(message.guild, 'levels') || {};
			const entry: LevelEntry = levels[message.author.id] || { totalExperience: 0, experience: 0, experienceNext: Levels.levelFunction(0), level: 0 };
			let totalExperience: number = entry.totalExperience;
			let experience: number = entry.experience;
			let level: number = entry.level;
			let experienceNext: number = Levels.levelFunction(level);
			let leveledup: boolean = false;
			const expGain: number = getRandomInt(Levels.minExpPerMessage, Levels.maxExpPerMessage);

			totalExperience += expGain;
			experience += expGain;

			while (experience >= experienceNext) {
				experience -= experienceNext;
				experienceNext = Levels.levelFunction(level);
				level++;
				leveledup = true;
			}

			if (leveledup) {
				message.channel.send(`GG ${message.author}, you just advanced to **level ${level}** !`);
			}

			levels[message.author.id] = { totalExperience, experience, level, experienceNext };
			Levels.client.provider.set(message.guild, 'levels', levels);
		}
		return;
	}

	public static setupListeners(client: CommandoClient): void {
		client.on('message', Levels.onMessage);
		Levels.client = client;
		Levels.setup = true;
	}

	public static levelFunction(level: number): number {
		return 5 * level * level + 50 * level + 100;
	}

	private static lastMessageMap: Map<Guild, Map<User, number>> = new Map<Guild, Map<User, number>>();
	private static timeForExp: number = 60 * 1000;
	private static minExpPerMessage: number = 15;
	private static maxExpPerMessage: number = 25;
	private static client: CommandoClient;
	private static setup: boolean = false;
}
