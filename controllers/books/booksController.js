import Books from "../../models/Books.js";


// Agregar libro
export const agregarLibro = async (req, res) => {
    try {
        const nuevoLibro = new Books(req.body);
        const libroGuardado = await nuevoLibro.save();
        return res.status(201).json(libroGuardado);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// Actualizar libro
export const actualizarLibro = async (req, res) => {
    try {
        const libroActualizado = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(libroActualizado);
    } catch (error) {
        return res.status(500).json(error);
    }
};


//eliminar libro
export const deleteBook = async (req, res) => {

    try {
        await Books.findByIdAndDelete(req.params.id);
        return res.status(200).json("El libro se elimino con exito");
    } catch (error) {
        return res.status(500).json("El libro no se pudo elimiar", error);
    }
};

//Encontrar un libro
export const encontrarLibro = async (req, res) => {
    try {
        const book = await Books.findById(req.params.id).populate("author");
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json(error);
    }
};

//Listar todos los libros
export const listarLibros = async (req, res) => {
        try {
            const book = await Books.find().populate("author");
            return res.status(200).json(book);
        } catch (error) {
            return res.status(500).json(error);
        }
    
};

