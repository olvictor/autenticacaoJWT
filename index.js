require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { restart } = require('nodemon');

const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('ksopa')
})

app.post('/user/register', async (req,res)=>{
    const { name , password , email} = req.body

    if(!name){
        return res.status(422).json({
            msg: 'O username é obrigatório'
        })
    }
    
    if(!password){
        return res.status(422).json({
            msg: 'O password é obrigatório'
        })
    }
    
    if(!email){
        return res.status(422).json({
            msg: 'O email é obrigatório'
        })
    }

    const userExists =  await User.findOne({email: email})

    if(userExists){
        return res.status(422).json({
            msg:'Email já registrado'
        })
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash =  await bcrypt.hash(password, salt)


    const user = new User({
        name,
        email,
        password: passwordHash
    })
    try{
        await user.save()

        res.status(201).json({
            msg:'Usuário criado com sucesso .'
        })
    }catch(e){
        res.status(500).json({
            msg:e
        })
    }

})

app.post('/auth/user', async(req,res)=>{
    const { email , password} = req.body;
   
    if(!email){
        return res.status(422).json({
            msg: 'O email é obrigatório'
        })
    }
    if(!password){
        return res.status(422).json({
            msg: 'O password é obrigatório'
        })
    }
    
    const user =  await User.findOne({email: email})

    if(!user){
        return res.status(404).json({
            msg:'Usuário não encontrado'
        })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({
            msg:'Senha incorreta'
        })
    }

    try{
        const secret = process.env.SECRET
        
        const token = jwt.sign({
            id: user._id,
        }, 
        secret,
        )
        res.status(200).json({
            msg:'Autenticacao realizada com sucesso',
            token
        })

    }
    catch(e){
        console.log(e)
        res.status(500).json({
            msg:e
        })
    }
})



const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7listva.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    app.listen(3000)
    console.log('servidor conectado')
}).catch((e)=> console.log(e))

