import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        const { password, ...userData } = user._doc;

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            error: false,
            data: { ...userData, token }
        })
    } catch (error) {
        return res.status(500).json({ message: error });
    }

}

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña requeridos" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Usuario ya existe" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);

        // Save user
        const user = new User(req.body);
        const newUser = await user.save();


        return res.status(201).json({ newUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}