import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo Backend API',
            version: '1.0.0',
            description: 'API Documentation for the Todo Backend Application',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./controllers/*.js'],
};

export default swaggerJSDoc(options);
