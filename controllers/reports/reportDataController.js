import Reserva from "../../models/Reserva.js";

export const infoReservas = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const reservaciones = await Reserva.aggregate([
            {
                $match: {
                    horaYfecha: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $unwind: "$userData"

            },
            {
                $addFields: {
                    'userData.ciclo': {
                        $cond: {
                            if: { $or: [{ $eq: ['$userData.semestre', null] }, { $not: ['$userData.semestre'] }] },
                            then: "Administrativo",
                            else: {
                                $switch: {
                                    branches: [
                                        { case: { $and: [{ $gte: ['$userData.semestre', 1] }, { $lte: ['$userData.semestre', 4] }] }, then: 'Técnico' },
                                        { case: { $and: [{ $gte: ['$userData.semestre', 5] }, { $lte: ['$userData.semestre', 6] }] }, then: 'Tecnológico' },
                                        { case: { $and: [{ $gte: ['$userData.semestre', 7] }, { $lte: ['$userData.semestre', 10] }] }, then: 'Profesional' }
                                    ],
                                    default: 'Administrativo'
                                }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$userData._id',
                    userData: { $first: '$userData' },
                    countReservations: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$userData.Programa',
                    users: { $push: '$$ROOT' },
                    countStudents: { $sum: 1 },
                    totalReservations: { $sum: '$countReservations' }
                }
            },
            {
                $unwind: '$users'
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ["$users", { countStudents: "$countStudents", totalReservations: "$totalReservations" }] } }
            },
            {
                $project: {
                    _id: 1,
                    userData: {
                        name: 1,
                        semestre: 1,
                        Programa: 1,
                        ciclo: 1,
                        genero: 1
                    },
                    countReservations: 1,
                    countStudents: 1,
                    totalReservations: 1
                }
            }
        ]);

        res.status(200).json(reservaciones);

    }catch (error) {
        res.status(404).json({ message: error.message });
    }
    
};