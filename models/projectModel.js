const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    views:{
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model("Project", projectSchema)