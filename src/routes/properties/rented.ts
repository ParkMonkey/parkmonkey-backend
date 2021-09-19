import type { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export default async function getRentedPropertiesRoute(app: FastifyInstance) {
	app.get(
		'/properties/rented',
		{ preValidation: app.authenticate },
		async (request, reply) => {
			if (!request.user) throw new Error('User not authenticated');
			const rentedProperties = await request.prisma.activeRental.findMany({
				select: {
					property: true,
				},
				where: {
					renterId: request.user.id,
				},
			});
			const properties = rentedProperties.map((value) => {
				return value.property;
			});
			return reply.status(StatusCodes.OK).send(properties);
		}
	);
}
