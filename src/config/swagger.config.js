import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
             title: "Documentación del Ecommerce",
            description: "App de prueba para el desafio 13 de la clase 39."
        }
    }, 
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions);
export default specs;