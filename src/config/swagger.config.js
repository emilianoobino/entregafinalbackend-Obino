import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentación del Ecommerce",
            description: "App de prueba para el desafio 13 de la clase 39."
        }
    },
    apis: ['./src/docs/**/*.yaml']
}

const specs = swaggerJsDoc(swaggerOptions)
export { swaggerUi, specs }