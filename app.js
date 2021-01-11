const express = require('express')
const app = express()

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
})

const io = require('socket.io')(server, {cors: { origin: '*',}});
app.use(function (req, res, next) {
    req.io = io
    next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('cors')())

app.use("/api", require('./routes/auth'))
app.use("/api/user", require('./routes/user'))
app.use("/api/departement", require('./routes/departement'))
app.use("/api/message", require('./routes/message'))
app.use("/api/conversation", require('./routes/conversation'))

const errorHandlers = require('./handlers/errorHandlers')
app.use(errorHandlers.notFound)
app.use(errorHandlers.mongooseErrors)
if (process.env.ENV === "dev") {
    app.use(errorHandlers.developmentErrors)
} else {
    app.use(errorHandlers.productionErrors)
}

module.exports = app