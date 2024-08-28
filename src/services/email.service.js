import nodemailer from "nodemailer";
import configObject from "../config/config.js";
import { logger } from '../middlewares/errors/index.js';


class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "chaval198678@gmail.com",
                pass: "emud itxo icac omvq"
            }
        })
    }

    async _sendEmail(mailOptions) {
        try {
            logger.info("Intentando enviar email a:", mailOptions.to);
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            logger.error("Error al enviar el correo", {
                message: error.message,
                stack: error.stack,
                email: mailOptions.to,
                mailOptions
            });
            throw error; // Re-lanzar el error si es necesario manejarlo en otro lugar
        }
    }
    
    async sendPurchaseEmail (emailData) {
        let productsTable = `
        <table border="1" cellpadding="5" cellspacing="0">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
        `;

        // Recorrer los productos para agregarlos a la tabla
        emailData.products.forEach(product => {

            productsTable += `
                <tr>
                    <td>${product.product.description}</td>
                    <td>${product.qty}</td>
                    <td>€ ${product.unitPrice.toFixed(2)}</td>
                    <td>€ ${(product.qty * product.unitPrice).toFixed(2)}</td>

                </tr>
            `;
        });

        productsTable += `
                    <tr>
                        <td colspan=3>Total de la Compra</td>
                        <td> € ${emailData.ammount}</td>
                    </tr>
                </tbody>
            </table>
        `;

        const email = emailData.purchaser;

        const mailOptions = {
            from: "Tony´s funko <chaval198678@gmail.com>",
            to: email,
            subject: "Tony´s funko - Detalles de tu pedido",
            html:`
                <h1>Tony´s funko - Confirmación de compra </h1>
                <p>Gracias por tu compra ${email} </p>
                <p>El número de tu orden es: ${emailData.code} </p>
                <p>Detalle de tu compra: </p>
                ${productsTable}
            `
        }
        
        await this._sendEmail(mailOptions);
    }

    async sendResetEmail (email, first_name, token) {
        const mailOptions = {
            from: "Tony´s funko <chaval198678@gmail.com>",
            to: email,
            subject: "Tony´s funko - Restablecimiento de contraseña",
            html:`
                <h1>Restablecimiento de contraseña </h1>
                <p>Hola ${first_name}! </p>
                <p>Pediste restablecer la contraseña,
                te enviamos el token para que restablezcas tu password 
                <strong>${token}</strong> </p>
                <p> Este código expira en 1 hora.</p>
                <a href="${configObject.base_url}/password"> Restablecer contraseña</a>
            `
        }
        await this._sendEmail(mailOptions);
    }

    async sendNotificationToUser (email, message) {
        const mailOptions = {
            from: "Tony´s funko <chaval198678@gmail.com>",
            to: email,
            subject: "Tony´s funko - Notificación",
            html:`
                <h1>Notificación de Tony´s funko: </h1>
                <p>${message}</p>
            `
        }
        await this._sendEmail(mailOptions);
    }
}

export default EmailManager;

