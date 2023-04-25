const mongoose = require('mongoose')

const fotosSchema = mongoose.Schema({
    fotos:{
        url:{
            type: String,
            required: true,
        }
    }  
})

module.exports = mongoose.model("fotos", fotosSchema, "fotos");