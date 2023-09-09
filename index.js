require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bycript = require('bcrypt')
const jwt = require('jsonwebtoken');
const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('ksopa')
})

app.post('/user/register', async (req,res)=>{
    const { name , password , email} = req.body

    if(!name){
        return res.json({
            msg: 'O username é obrigatório'
        })
    }
    
    if(!password){
        return res.json({
            msg: 'O password é obrigatório'
        })
    }
    
    if(!email){
        return res.json({
            msg: 'O email é obrigatório'
        })
    }

    res.send('askop')

})


const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7listva.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    app.listen(3000)
    console.log('servidor conectado')
}).catch((e)=> console.log(e))

