import type { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export default async function rentPropertyRoute(app: FastifyInstance) {
  // Rent a property
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

  // Unrent a property
	app.delete(
		'/properties/:propertyId/rent',
		{ preValidation: app.authenticate },
		async (request, reply) => {
			if (!request.user) throw new Error('User not authenticated');
			const propertyId = Number(
				(request.params as { propertyId: string }).propertyId
			);
			await request.prisma.activeRental.delete({
				where: {
					propertyId_renterId: {
						propertyId,
						renterId: request.user.id,
					},
				},
			});
			return reply.status(StatusCodes.OK).send({ message: 'Successful' });
		}
	);
}
