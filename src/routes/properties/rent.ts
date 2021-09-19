import type { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export default async function rentPropertyRoute(app: FastifyInstance) {
	app.post(
		'/properties/:propertyId/rent',
		{ preValidation: app.authenticate },
		async (request, reply) => {
			// In a real world application, this would take payment from user's account as well.
			if (!request.user) throw new Error('User not authenticated');
			const propertyId = Number(
				(request.params as { propertyId: string }).propertyId
			);
			await request.prisma.activeRental.create({
				data: {
					renterId: request.user.id,
					propertyId,
				},
			});
			return reply.status(StatusCodes.CREATED).send({ message: 'Successful' });
		}
	);
}
