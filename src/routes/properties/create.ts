import axios from 'axios';
import type { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

type CreatePropertyProperties = {
	address: string;
};

export default async function createPropertyRoute(app: FastifyInstance) {
	app.post(
		'/properties',
		{ preValidation: app.authenticate },
		async (request, reply) => {
			if (!request.user) throw new Error('User not authenticated');
			const { address } = request.body as CreatePropertyProperties;
			if (process.env.GEOAPIFY_KEY) {
				const response = await axios.get(
					'https://api.geoapify.com/v1/geocode/search',
					{
						params: {
							text: address,
							apiKey: process.env.GEOAPIFY_KEY,
							limit: 1,
						},
					}
				);
				const data = response.data.features[0].properties;
				const formattedAddress = data.formatted;
				const longitude = data.lon;
				const latitude = data.lat;
				try {
					await request.prisma.property.create({
						data: {
							address: formattedAddress,
							latitude,
							longitude,
							ownerId: request.user?.id,
						},
					});
					return reply
						.status(StatusCodes.CREATED)
						.send({ message: 'Successful' });
				} catch (e) {
					// Assuming that the error is a conflict (property already registered)
					return reply
						.status(StatusCodes.CONFLICT)
						.send({ error: 'Property already exists.' });
				}
			} else {
				throw new Error('No API key configured in .env for Geoapify.');
			}
		}
	);
}
