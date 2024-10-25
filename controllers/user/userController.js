import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { readTemplateHtmlEmail, replaceDataTemplate, sendMail } from "../../util/email.js";

// notificar al usuario la contraseña generada
const sendNotficationUserNewAccount = async (email, name, password) => {
    const htmlTemplate = await readTemplateHtmlEmail('account_created');
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Registro de cuenta exitoso',
        html: replaceDataTemplate(htmlTemplate, { email, name, password})
    }

    await sendMail(mailOptions);
}


// Function to generate a random password
function generateRandomPassword() {
    const length = 8; // Length of the generated password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}

// crear usuario
export const createUser = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(409).json({ message: "Usuario ya existe" });
        }
        const newUser = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        const password = generateRandomPassword();
        newUser.password = password;

        
        newUser.password = await bcrypt.hash(newUser.password, salt);
        const user = await newUser.save();
        await sendNotficationUserNewAccount(user.email, user.name, password);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

//actualizar usuario
export const udpateUser = async (req, res) => {
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
        {$set: req.body},{new: true});
        
        return res.status(200).json(updatedUser);
    }catch (error) {
        return res.status(500).json(error);
    }
};

//eliminar usuario
export const deleteUser = async (req, res) => {

    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("El usuario a sido eliminado con exito");
    } catch (error) {
        return res.status(500).json(error);
    }
};

//find user
export const findUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc;
        return res.status(200).json(info);
    } catch (error) {
        return res.status(500).json(error);
    }
};

//find all user
export const findUserAll = async (req, res) => {
        try {
            const users = await User.find();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json(error);
        }
    
};
