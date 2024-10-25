import mongoose from "mongoose";
import Books from './Books.js'; 
import User from './User.js'; 

const reservaSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Books,
        required: true
    },
    tipoPrestamo: {
        type: String,
        enum: ['Interno', 'Externo'],
        required: true
    }, 
    horaYfecha: {
        type: Date,
        default: Date.now
    },
    fechaExpiracion: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Entregado', 'Cancelado'],
        default: 'Pendiente',
        required: true
    }
},{
    timestamps: true
});

const Reserva = mongoose.model('Reserva', reservaSchema);
export default Reserva;