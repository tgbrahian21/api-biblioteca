import Reserva from "../../models/Reserva.js";
import Books from "../../models/Books.js";
import { readTemplateHtmlEmail, replaceDataTemplate, sendMail } from "../../util/email.js";
import User from "../../models/User.js";
import moment from "moment";


const notificarReserva = async ({ email, user, book, date, time }) => {

    const htmlTemplate = await readTemplateHtmlEmail('reservation_confirmed');
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Reserva confirmada',
        html: replaceDataTemplate(htmlTemplate, { user, book, date, time })
    }
    await sendMail(mailOptions);
}

//agregar reserva
export const agregarReserva = async (req, res) => {
    try {
        const { bookId, userId } = req.body;

        // Verificar que haya suficientes unidades disponibles
        const book = await Books.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "El libro no existe" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "El usuario no existe" });
        }


        // cuenta las reservas activas que tiene el libro y que no hayan expirado
        const activeReservations = await Reserva.countDocuments({
            bookId: bookId,
            status: { $in: "Pendiente" },
        });

        if (activeReservations >= book.unidad) {
            return res.status(400).json({ message: "No hay suficientes unidades disponibles" });
        }
        const nuevoReserva = new Reserva(req.body);
        const reservaGuardado = await nuevoReserva.save();
        await notificarReserva({
            email: user.email,
            user: user.name,
            book: book.title,
            date: moment(reservaGuardado.horaYfecha).format('DD/MM/YYYY'),
            time: moment(reservaGuardado.fechaExpiracion).format('DD/MM/YYYY')
        });
        return res.status(201).json(reservaGuardado);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};


//actualizar reserva
export const actualizarReserva = async (req, res) => {
    try {
        const reservaActualizado = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(reservaActualizado);
    } catch (error) {
        return res.status(500).json(error);
    }
};

//eliminar reserva
export const deleteReserva = async (req, res) => {

    try {
        await Reserva.findByIdAndDelete(req.params.id);
        return res.status(200).json("La reserva a sido eliminada");
    } catch (error) {
        return res.status(500).json("La reserva no pudo ser eliminada", error);
    }
};

//Encontrar un reserva
export const encontrarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id).populate('userId').populate('bookId').populate('bookId');
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(500).json(error);
    }
};

//Listar todos las reservas
export const listarReserva = async (req, res) => {
    const { isNew } = req.query;
    try {

        if (isNew) {
            const reserva = await Reserva.find()
                .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
                .limit(5) // Obtener solo las 5 reservas más recientes
                .populate('userId') // Traer la información del usuario asociado
                .populate('bookId'); // Traer la información del libro asociado
            return res.status(200).json(reserva);
        }

        const reserva = await Reserva.find().populate('userId').populate('bookId');
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(500).json(error);
    }

};

