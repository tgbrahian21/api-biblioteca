import Autor from "../../models/Autor.js";


//agregar autor
export const agregarAutor = async (req, res) => {
    try {
        const nuevoAutor = new Autor(req.body);
        const AutorGuardado = await nuevoAutor.save();
        return res.status(201).json(AutorGuardado);
    } catch (error) {
        return res.status(500).json(error);
    }
};


//actualizar autor
export const actualizarAutor = async (req, res) => {
    try {
        const autorActualizado = await Autor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(autorActualizado);
    } catch (error) {
        return res.status(500).json(error);
    }
};

//eliminar autor
export const elimiarAutor = async (req, res) => {

    try {
        await Autor.findByIdAndDelete(req.params.id);
        return res.status(200).json("El autor a sido eliminado con exito");
    } catch (error) {
        return res.status(500).json(error);
    }
};

//find autor
export const encontrarAutor = async (req, res) => {
    try {
        const autor = await Autor.findById(req.params.id);
        return res.status(200).json(autor);
    } catch (error) {
        return res.status(500).json(error);
    }
};

//find all autor
export const findAutorAll = async (req, res) => {
        try {
            const autor = await Autor.find();
            return res.status(200).json(autor);
        } catch (error) {
            return res.status(500).json(error);
        }
    
};