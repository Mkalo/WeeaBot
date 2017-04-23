/* Powered By Giphy */
import * as request from 'request-promise';

const { giphyToken }: { giphyToken: string } = require('../settings.json');

interface GiphyResponse {
	data?: {
		gyphyId: string
		id: string
	};
	meta?: {
		status: number
		msg: string
		response_id: string
	};
};

export class GiphyApi {
	public static async validateGif(giphyId: string): Promise<boolean> {
		return request({
			uri: `http://api.giphy.com/v1/gifs/${giphyId}?api_key=${giphyToken}`,
			json: true
		})
			.then((response: GiphyResponse) => new Promise<boolean>((resolve: (value: boolean) => void, reject: (value: boolean) => void) => {
				if (response.meta.status !== 200) {
					reject(false);
				} else {
					resolve(true);
				}
			}))
			.catch(() => new Promise<boolean>((resolve: (value: boolean) => void, reject: (value: boolean) => void) => reject(false)));
	}
}
