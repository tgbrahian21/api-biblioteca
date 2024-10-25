import fs from "fs";
import util from "util"
import { configMailer } from "../config/sendEmail.js";
import { fileURLToPath } from 'url';
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Envía un correo electrónico utilizando un objeto de opciones de correo.
 * @param {object} mailOptions - Objeto que contiene las opciones del correo electrónico.
 * @param {string} mailOptions.from - La dirección de correo electrónico del remitente.
 * @param {string} mailOptions.to - La dirección de correo electrónico del destinatario.
 * @param {string} mailOptions.subject - El asunto del correo electrónico.
 * @param {string} mailOptions.html - El contenido HTML del cuerpo del correo electrónico.
 * @returns {Promise<string>} - Una promesa que resuelve con el ID del correo enviado o rechaza con un error.
 */
export const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        const tranporter = configMailer();

        tranporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error al enviar correo:", error);
                reject(error); // Rechazar la promesa con el error
            } else {
                console.log('Correo enviado:', info.response);
                resolve(info.messageId); // Resolver la promesa con el ID del correo enviado
            }
        });
    });
}

/**
 * Lee el contenido de una plantilla HTML de correo electrónico.
 * @param {string} templateName - nombre de la plantilla en la carpeta de plantillas.
 * @returns {Promise<string>} - Una promesa que resuelve con el contenido de la plantilla HTML.
 */
export const readTemplateHtmlEmail = async (templateName) => {
    const localTemplates = path.join(__dirname, '../public/templates/');
    const readFile = util.promisify(fs.readFile);
    const templatePath = localTemplates + templateName + ".html"
    const htmlTemplate = await readFile(templatePath, 'utf-8');
    return htmlTemplate;
}

/**
 * Reemplaza las variables en una plantilla HTML con datos proporcionados.
 * @param {string} htmlTemplate - La plantilla HTML que contiene variables a reemplazar.
 * @param {object} data - Objeto que contiene las claves y valores para realizar los reemplazos en la plantilla.
 * @returns {string} - La plantilla HTML actualizada con los datos reemplazados.
 */
export const replaceDataTemplate = (htmlTemplate, data) => {
    // Iterar sobre las claves del objeto y realizar los reemplazos
    Object.keys(data).forEach((key) => {
        const patron = new RegExp(`{{${key}}}`, 'g');
        htmlTemplate = htmlTemplate.replace(patron, data[key]);
    })

    return htmlTemplate;
}