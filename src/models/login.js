const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const saltRounds = 10;



const loginSchema = mongoose.Schema({
    id_usuario:{
        type: String,
        required: true,
    },
    usuario:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    nombre:{
        type:String,
        required: true,
    }
});

loginSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        const document = this;

        bcrypt.hash(document.password, saltRounds, (err, hashedPassword)=>{
            if(err){
                next(err);
            }else{
                document.password = hashedPassword;
                next();
            }
        });
    }else{
        next()
    }
});

loginSchema.methods.isCorrectPasswword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    });
}
module.exports = mongoose.model("usuarios", loginSchema);