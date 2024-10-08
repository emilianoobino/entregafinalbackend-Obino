import ProductosModel from "../models/productos.model.js";

import TicketsModel from "../models/tickets.model.js";
import CartRepository from "../repositories/cart.repository.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import ProductService from "../services/product.service.js";
import moment from 'moment';
import { generateProduct } from "../utils/utils.js"; // Mocking

const cartRepository = new CartRepository();
const cartService = new CartService();
const userService = new UserService();
const productService = new ProductService();

class ViewsController {

    // Vista de productos
    async renderProducts(req, res) {
        if (!req.session.login) return res.redirect("/login");

        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        let sort = "_id"; // Valor por defaul de sort
        if (req.query.sort === "asc") sort = "price";
        if (req.query.sort === "desc") sort = "-price";

        try {
            const result = await ProductosModel.paginate({}, { limit, page, sort: sort });

            const products = result.docs.map(product => {
                const { ...rest } = product.toObject();
                return rest;
            })

            // Envio la data para ser renderizada           
            res.render("products", {
                products: products,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                currentPage: result.page,
                totalPages: result.totalPages,
                limit: limit,
                sort: req.query.sort,
                session: req.session
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor al renderizar los productos"
            });
            req.logger.error("Error interno del servidor al renderizar los productos");
        }
    }

    // Vista del carrito
    async renderCart(req, res) {
        // Si no está logueado redirecciono al login
        if (!req.session.login) return res.redirect("/login");

        try {

            // Obtengo el cid si viene como parámetro, sino uso el cid de la sesión
            let cid = "";
            if (req.params.cid) {
                cid = req.params.cid;
            } else {
                cid = req.session.user.cart;
            }

            // Busco el carrito y convierto el resultado en un objeto para poder trabajar más cómodo
            const resultado = await cartRepository.findById(cid);
            let carrito = resultado.toObject();

            // Verificar si el carrito está vacío o no existe
            if (!carrito || carrito.products.length === 0) {
                return res.render("carts", {
                    cid: cid,
                    carrito: {
                        products: []
                    },
                    provTotal: 0,
                    session: req.session
                });
            }

            // Obtengo el subtotal de cada item
            carrito.products.forEach(item => {
                item.subtotal = (item.quantity * item.product.price).toFixed(2);
            });
            

            // Obtengo el total provisorio del carrito
            const provTotal = await cartService.calculateTotal(cid);

            // Envio la data para ser renderizada
            res.render("carts", {
                cid: cid,
                carrito,
                provTotal,
                session: req.session
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor al renderizar el carrito",
                payload: error.message
            });
            req.logger.error("Error interno del servidor al renderizar el carrito");
        }
    }

    // Vista de nuevo producto
    async renderProductForm(req, res) {
        if (!req.session.login) return res.redirect("/login");

        let owner = req.session.user.role === "admin" ? "admin" : req.session.user.email;
        let pid = req.params.pid;

        try {
            if(pid) {
                let result = await productService.getProductById(req.params.pid);
                let product = JSON.parse(JSON.stringify(result));
                res.render("editProduct", { session: req.session, owner, product});
            } else {
                res.render("editProduct", { session: req.session, owner });
            }
            

        } catch (error) {
            res.status(500).send("Error al editar producto")
        }
        
    }

    // Vista de usuarios
    async renderUsers(req, res) {
        if (!req.session.login) return res.redirect("/login");
        let result = await userService.getAllUsers();
        let users = result.map(user => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            id: user._id,
            documents: user.documents.map(doc => ({
                name: doc.name,
                reference: doc.reference
            })),
            role: user.role,
            last_connection: user.last_connection ? moment(user.last_connection).format('YYYY-MM-DD HH:mm') : 'N/A'

        }))

        res.render("users", { session: req.session, users });
    }


    // Vista de edición de usuarios
    async editUser(req, res) {
        if (!req.session.login) return res.redirect("/login");

        const uid = req.params.uid;

        try {
            let user = await userService.getUserById(uid); // Asume que tienes un servicio que puede obtener un usuario por ID
            if (!user) {
                res.status(404).send("Usuario no encontrado");
                return;
            }

            // Preparar la información del usuario para la vista
            let userData = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                _id: user._id,
                documents: user.documents.map(doc => ({
                    name: doc.name,
                    reference: doc.reference
                })),
                role: user.role,
                last_connection: user.last_connection ? moment(user.last_connection).format('YYYY-MM-DD HH:mm') : 'N/A'
            };

            res.render("editUser", { session: req.session, user: userData });
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            res.status(500).send("Error interno del servidor");
        }

    }


    // Vista de ventas
    async renderSales(req, res) {
        if (!req.session.login) return res.redirect("/login");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 

        try {
            const options = {
                page: page,
                limit: limit,
                lean: true,
                sort: { purchase_datetime: -1 } 
            };


            const result = await TicketsModel.paginate({}, options);

            for (let ticket of result.docs) {
                ticket.purchase_datetime = moment(ticket.purchase_datetime).format('YYYY-MM-DD HH:mm');
                ticket.ammount = ticket.ammount.toFixed(2);
                let customer = await userService.getUserByEmail(ticket.purchaser);
                ticket.customerName = customer ? (customer.first_name + " " + customer.last_name) : "Usuario inexistente";
            }
            res.render("sales", {
                session: req.session,
                tickets: result.docs,
                totalPages: result.totalPages,
                currentPage: page,
                limit
            });
    

        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }  
    }


    // Vista del login
    async renderLogin(req, res) {
        res.render("login");
    }

    // Vista del registro
    async renderRegister(req, res) {
        res.render("register", { session: req.session });
    }

    // Vista de Realtime Products
    async renderRealTimeProducts(req, res) {
        if (!req.session.login) return res.redirect("/login");
        res.render("realTimeProducts", { session: req.session });
    }

    //  Vista del chat
    async renderChat(req, res) {

    }

    async renderAccessDenied(req, res) {

        res.render("accessdenied", { session: req.session });
    }



    async mockingProducts(req, res) {
        try {
            let products = [];
            for (let i = 0; i < 100; i++) {
                products.push(generateProduct());
            }


            res.render("products", {
                products: products
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Fallo al generar productos fake",
                error: error.message
            });
            req.logger.error("Fallo al generar productos fake");

        }
    }

    async renderResetPassword(req, res) {
        res.render("resetpass");
    }

    async renderCambioPassword(req, res) {
        res.render("changepass");
    }

    async renderConfirmacion(req, res) {
        res.render("sendconfirm");
    }
}

export default ViewsController;