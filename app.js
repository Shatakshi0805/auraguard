const morgan = require("morgan")
const express = require("express")
const app = express()
const cors = require("cors")
const viewRoutes = require('./routes/views');
const path = require("path")

const reportRouter = require("./routes/reportRoute")

app.use(cors())
app.use(express.json());

// to serve front-end using express
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// below line means all routes in reportRouter will be prefixed with /api/report
app.use("/api/report", reportRouter)


app.use('/api/views', viewRoutes);


module.exports = app