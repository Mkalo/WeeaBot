import { LevelEntry, Levels, LevelsMap } from '../../Library/Levels';

import { Guild, GuildMember } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { NextFunction, Request, Response, Router } from 'express';

interface MemberResult {
	id: string;
	name: string;
	discriminator: string;
	avatarURL: string;
	displayName: string;
	displayColor: number;
	displayHexColor: string;
	levelInfo: LevelEntry;
};

export class Api {
	public route: Router;
	private client: CommandoClient;

	constructor(client: CommandoClient) {
		this.client = client;

		this.route = Router();

		this.route.get('/guilds/:id/members', (req: Request, res: Response, next: NextFunction) => {
			const guild: Guild = this.client.guilds.get(req.params.id);
			if (guild) {
				guild.fetchMembers()
					.then((result: Guild) => {
						const levels: LevelsMap = this.client.provider.get(result, 'levels') || {};
						const members: MemberResult[] = [];
						result.members.forEach((member: GuildMember) => {
							if (member.user.bot) return;
							let avatarURL: string;
							if (member.user.avatar) {
								avatarURL = `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.jpg`;
							} else {
								avatarURL = member.user.defaultAvatarURL;
							}
							members.push({
								id: member.id,
								name: member.user.username,
								discriminator: member.user.discriminator,
								avatarURL,
								displayName: member.displayName,
								displayColor: member.displayColor,
								displayHexColor: member.displayHexColor,
								levelInfo: levels[member.id] || { level: 0, experience: 0, totalExperience: 0, experienceNext: Levels.levelFunction(0) }
							});
						});
						res.send({ status: 200, members });
					});
			} else {
				next();
			}
		});

		this.route.get('*', (req: Request, res: Response) => {
			res.status(404);
			res.send({ status: 404 });
		});

	}

	public get(): Router {
		return this.route;
	}
}
