import mongoose from "mongoose";



const AutorSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    
},{
    timestamps: true
});

const Autor = mongoose.model('Autor', AutorSchema);
export default Autor;