import type { FastifyInstance } from 'fastify';

// Query should contain the current location of the user
type ListNearbyPropertiesQuery = {
	longitude: string | number;
	latitude: string | number;
};

export default async function listPropertiesRoute(app: FastifyInstance) {
	// Get properties within 500m
	app.get(
		'/properties',
		{ preValidation: app.authenticate },
		async (request, reply) => {
			const userLocation = request.query as ListNearbyPropertiesQuery;
			if (!userLocation.latitude || !userLocation.longitude) {
				return reply
					.status(400)
					.send({ message: 'Longitude or latitude is missing from query.' });
			}
			const properties = await request.prisma.property.findMany({
				where: {
					latitude: {
						gte: Number(userLocation.latitude) - 0.005,
						lte: Number(userLocation.latitude) + 0.005,
					},
					longitude: {
						gte: Number(userLocation.longitude) - 0.005,
						lte: Number(userLocation.longitude) + 0.005,
					},
				},
			});
			return reply.send(properties);
		}
	);
}
