import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title      : "Pharaoh's Guide API",
      version    : '1.0.0',
      description: 'AI-powered Egyptian tourist companion API',
    },
    servers: [
      { url: 'http://localhost:3000',                              description: 'Local' },
      { url: 'https://pharaohs-guide.onrender.com', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type  : 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./modules/**/*.routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);