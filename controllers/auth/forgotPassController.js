import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { readTemplateHtmlEmail, replaceDataTemplate, sendMail } from '../../util/email.js';

const sendResetPasswordCodeEmail = async (email, token, id) => {
    const htmlTemplate = await readTemplateHtmlEmail('forgot_password');
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña',
        html: replaceDataTemplate(htmlTemplate, { token, id })
    }

    await sendMail(mailOptions);
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // Verificar si el correo electrónico está presente
    if (!email) {
        return res.status(400).json({ error: "Email requerido" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ Message: "Email no encontrado", error: null });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Actualizar el código de restauración en la base de datos
        user.tokenResetPass = token;
        await user.save();

        // Enviar el código de restauración por correo electrónico
        await sendResetPasswordCodeEmail(email, token, user._id);

        return res.status(200).json({
            message: "Enlace de recuperacion de contraseña enviado al correo electronico",
            error: null
        });

    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

