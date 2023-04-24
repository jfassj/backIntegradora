const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const loginSchema = require('./src/models/login');
require ('dotenv').config();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log('connected to mongoDB Atlas');
})
.catch((err)=>{
  console.log(`not connected to MongoDB Atlas: ${err}`);
});



app.get('/', (req, res) => {
  res.send('hello world');
})

app.post('/register', (req, res) =>{
  const {username, password} = req.body;

  const loginSchema = new user({username, password});

  user.save(err=>{
    if(err){
      res.status(500).send('ERROR AL REGISTRAR AL USUARIO');
    }else{
      res.status(200).send('USUARIO REGISTRADO');
    }
  })
});

app.post('/authenticate', (req, res) => {
  const {username, password} = req.body;
  loginSchema.findOne({username}, (err, user)=>{
    if(err){
      res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
    }else if(!user){
      res.status(500).send('EL USUARIO NO EXISTE');
    }else{
      loginSchema.isCorrectPassword(password, (err, result)=>{
        if(err){
          res.status(500).send('ERROR AL AUTENTICAR')
        }else if(result){
          res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
        }else{
          res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA')
        }
      });
    }
  })
});

app.listen(port, ()=>console.log(`servidor escuchando en el puerto ${port}`));

module.exports = app;