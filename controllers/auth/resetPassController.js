import User from "../../models/User.js";
import bcrypt from "bcrypt";

let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;

const resetPass = async (req, res) => {
    if (!regExPassword.test(req.body.password)) {
        return res.status(400).json({
            message: "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y debe tener entre 6 y 20 caracteres"
        })
    }

    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await User.updateOne({ _id: req.params.id, tokenResetPass: req.params.token }, { password: req.body.password, tokenResetPass: "" });

        return res.status(200).json({ Message: "Contraseña cambiada con éxito" });

    }

    catch (error) {
        return res.status(500).json({ error: error.message });

    }

}


export default resetPass;