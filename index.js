const express = require('express')
require('dotenv').config()
let app = express()
const {db} = require('./config/db.js')
const Sentry = require("@sentry/node")
db()

app.use(express.json())

const PORT = process.env.PORT
const DSN = process.env.DSN

const { ProfilingIntegration } = require("@sentry/profiling-node")
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
const routes = require("./routes/index.js")

app.use('/api', routes)

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title:  "Users API",
          description: "API for getting, creating and updating users and their todo tasks"
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              name: 'Authorization'
            }
          }
        }
    },
    apis: ["./routes/authorization.js", "./routes/tasks.routes.js"]
}
  
const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve,swaggerUi.setup(swaggerDocs))


Sentry.init({
    dsn: DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
  
  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
  
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());


app.listen(PORT,() => {
    console.log(`example app listenig on ${PORT}`)
})