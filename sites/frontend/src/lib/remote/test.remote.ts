import { getRequestEvent, query } from '$app/server';
import { env } from '$env/dynamic/private';
import * as z from 'zod';

const kqlSchema = z.object({
	query: z.string(),
	select: z.record(z.string(), z.union([z.string(), z.boolean(), z.array(z.string())])).optional()
});

export const kql = query(z.string(), async (query) => {
	const { fetch } = getRequestEvent();

	const auth =
		'Basic ' + Buffer.from(`${env.KIRBY_API_USER}:${env.KIRBY_API_PASSWORD}`).toString('base64');

	try {
		const test = await fetch(env.KIRBY_API_URL, {
			method: 'POST',
			headers: {
				Authorization: auth,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: query
			})
		});

		const data = await test.json();
		console.log(data);
	} catch (error) {
		console.error('Error fetching data from Kirby API:', error);
		throw error;
	}

	return 'test';

	// try {
	// 	const response = await fetch(env.KIRBY_API_URL, {
	// 		method: 'POST',
	// 		headers: {
	// 			Authorization:
	// 				'Basic ' +
	// 				Buffer.from(`${env.KIRBY_API_USER}:${env.KIRBY_API_PASSWORD}`).toString('base64')
	// 		},
	// 		body: JSON.stringify({
	// 			query: 'page("home").title'
	// 		})
	// 	});
	// } catch (error) {
	// 	console.error('Error fetching data from Kirby API:', error);
	// 	throw error;
	// }

	// const data = await response.json();
	// console.log(data);

	// return data;
});
