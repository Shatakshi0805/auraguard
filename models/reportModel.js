const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    typeOfIncident:{
        type: String,
        required: [true, "Type of incident must be mentioned"]
    },
    location: {
        type: String,
        required: [true, "location of incident must be specified"]
    },
    description: {
        type: String,
        required: true,
        minlength: [10]
    },
    landmarks:{
        type: String
    },
    attackerKnown: {
        type: String
    }, 
    attackerGender: {
        type: String
    },
    timeStamp : {
        type: String,
        default: new Date().toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
        })
    }
})

// create model from Schema that we'll be using to modify the Data in mongodb
const report = mongoose.model("Report", reportSchema)

module.exports = report