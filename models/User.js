import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    genero: {
        type: String,
        enum: ['Hombre', 'Mujer', 'Otro']
    },
    password: {
        type: String,
        required: true
    },
    tokenResetPass: {
        type: String,
        default: ""
    },
    telefono: {
        type: Number
    },
    semestre: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    codigo: {
        type: String
    },
    Programa: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    reservas:{
        type: Array
    },
    status: {
        type: Boolean,
        default: true
    },
   
},{
    timestamps: true
    
});

const User = mongoose.model('User', userSchema);
export default User;