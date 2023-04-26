const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const loginSchema = require('./src/models/login');
const fotosSchema = require('./src/models/fotos');
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

app.post('/authenticate',  (req, res) => {
  
  const {usuario, password} = req.body;
  loginSchema.findOne({usuario}).then((user)=>{
    console.log(user);
      if(user){
        bcrypt.compare(password, user.password, (err, result) =>{
          if(result){
            res.send({
              status: 200,
              resultado: {
                user,
                auth: result,
                mensaje: 'datos correctos',
              },
              // result,
            });
          }else{
            res.status(301).send('USUARIO O CONTRASEÑA INCORRECTA')
          }
        })
        
      }else{
        res.status(301).send('USUARIO NO REGISTRADO')
      }
  }).catch((err)=>{
      res.status(500).send(`ERROR: ${err}`)
  });
});

app.get('/fotos', (req, res)=>{
  fotosSchema.find()
  .then((data)=>{
    res.status(200).send({
      datos:cambiarDatos(data),
    })
  })
  .catch((err)=>{
    res.status(101).send(err);
  })
});

const cambiarDatos = (datos) => {
  let datos1 = [];
  datos.map((dato)=>(
    datos1.push({
      label: dato._id,
      value: dato.fotos.url,
    })
  ));
  return datos1;
};

app.delete('/delete', (req, res)=>{
  const {url} = req.body;
  fotosSchema.deleteOne({url:url})
  .then(()=>{
    res.send({
      status:200,
      resultado: {
        mensaje: 'datos elimminados',
      }
    })
  })
  .catch((err)=>{
    res.send({
      status: 301,
      resultado: {
        mensaje: `problemas con el servidor: ${err}`
      }
    })
  })
})

app.listen(port, ()=>console.log(`servidor escuchando en el puerto ${port}`));

module.exports = app;