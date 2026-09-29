import swaggerJSDoc from "swagger-jsdoc";
import "dotenv/config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Doctor Appointment API",
      version: "1.0.0",
      description: "REST API for booking doctor appointments",
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "DOCTOR", "USER"] },
          },
        },
        Speciality: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            icon: { type: "string" },
            isActive: { type: "boolean" },
          },
        },
        WorkingHours: {
          type: "object",
          properties: {
            day: { type: "integer", minimum: 0, maximum: 6, example: 1 },
            start: { type: "string", example: "09:00" },
            end: { type: "string", example: "17:00" },
            breakStart: { type: "string", example: "12:00" },
            breakEnd: { type: "string", example: "13:00" },
          },
        },
        Doctor: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            speciality: { type: "string" },
            bio: { type: "string" },
            price: { type: "number" },
            experienceYears: { type: "number" },
            slotDuration: { type: "integer", example: 30 },
            workingHours: {
              type: "array",
              items: { $ref: "#/components/schemas/WorkingHours" },
            },
            daysOff: {
              type: "array",
              items: { type: "string", format: "date" },
            },
            isActive: { type: "boolean" },
          },
        },
        Appointment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            patient: { type: "string" },
            doctor: { type: "string" },
            date: { type: "string", format: "date" },
            startTime: { type: "string", example: "09:00" },
            endTime: { type: "string", example: "09:30" },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
            },
            reason: { type: "string" },
            notes: { type: "string" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            _id: { type: "string" },
            recipient: { type: "string" },
            type: { type: "string" },
            title: { type: "string" },
            message: { type: "string" },
            isRead: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  },
  // files scanned for @swagger comments
  apis: ["./routes/*.js"],
};

export default swaggerJSDoc(options);
