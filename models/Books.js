import mongoose from "mongoose";
import Autor from "./Autor.js";



const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitulo: {
        type: String,
        required: true
    },
    n_asignatura: {
        type: String,
        required: true
    },
    codBook: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Autor,
        required: true
    },
    materia: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    ISBN: {
        type: String,
        required: true
    },
    ISSN: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    },
    unidad: {
        type: Number,
        required: true
    },
    numberPages: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    fechaPublicacion:{
        type: Date,
        required: true
    },
    
},{
    timestamps: true
});

const Books = mongoose.model('Books', bookSchema);
export default Books;