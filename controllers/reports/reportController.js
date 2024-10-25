import Reserva from "../../models/Reserva.js";
import Book from "../../models/Books.js";
import XlsxPopulate from "xlsx-populate";

// Encuentra todas las reservas
export const infoReserva = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Último día del mes

        // Consulta para buscar las reservaciones del mes actual
        const reservaciones = await Reserva.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: firstDayOfMonth, // Mayor o igual al primer día del mes
                        $lte: lastDayOfMonth // Menor o igual al último día del mes
                    }
                }
            },
            {
                $lookup: {
                    from: 'users', // Nombre de la colección de usuarios
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData' // Deshacer el array userData
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

        const doc = await XlsxPopulate.fromBlankAsync();
        const sheet = doc.sheet(0).name("Reservas");

        // Encabezados
        sheet.cell("A1").value("Nombre y Apellido");
        sheet.cell("B1").value("Semestre");
        sheet.cell("C1").value("Ciclo");
        sheet.cell("D1").value("Programa");
        sheet.cell("E1").value("Cantidad de Estudiantes por Programa");
        sheet.cell("F1").value("Genero");
        sheet.cell("G1").value("Cantidad de libros prestados");


        // Datos
        reservaciones.map((reserva, index) => {
            const i = index + 2;

            sheet.cell(`A${i}`).value(reserva.userData.name);
            sheet.cell(`B${i}`).value(reserva.userData.semestre);
            sheet.cell(`C${i}`).value(reserva.userData.ciclo);
            sheet.cell(`D${i}`).value(reserva.userData.Programa);
            sheet.cell(`E${i}`).value(reserva.countStudents);
            sheet.cell(`F${i}`).value(reserva.userData.genero);
            sheet.cell(`G${i}`).value(reserva.countReservations);


        });

        //ajuste de columnas
        const columns = [
            { key: 'A', width: 40 },
            { key: 'B', width: 10 },
            { key: 'C', width: 20 },
            { key: 'D', width: 15 },
            { key: 'E', width: 40 },
            { key: 'F', width: 15 },
            { key: 'G', width: 26 }
        ]

        columns.forEach(column => {
            sheet.column(column.key).width(column.width).hidden(false);
        })
        // Estilos
        sheet.range(`A1:G1`).style({
            bold: true,
            horizontalAlignment: 'center',
            verticalAlignment: 'center',
            fill: {
                type: 'solid',
                color: '12c702' // Color verde
            }
        });

        // Guardar archivo
        const buffer = await doc.outputAsync();

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Reservas.xlsx");
        return res.send(buffer);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//find all books
export const cantidadLibrosRegistrados = async (req, res) => {
    try {
        const cantidadLibros = await Book.countDocuments();
        return res.json({ cantidadLibros });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};

//cantidad de reservas en el mes actual

export const cantidadReservasMes = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59)

        const cantidadReservas = await Reserva.countDocuments({
            horaYfecha: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth
            }
        });
        return res.json({ cantidadReservas });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};


export const libroMasReservado = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

        const reservaciones = await Reserva.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "bookId",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $group: {
                    _id: "$bookId",
                    title: { $first: "$book.title" },
                    total: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            },
            {
                $limit: 1
            }
        ]);

        if (reservaciones.length === 0) {
            return res.json({ message: "No hay reservaciones en el mes actual" });
        }

        const libroMasReservado = reservaciones[0].title;

        return res.status(200).json({ libroMasReservado });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};


