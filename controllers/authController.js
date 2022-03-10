const { response } = require('express');
const Usuario = require('../models/Usuario');
const { hashSync, genSaltSync, compareSync } = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

exports.crearUsuario = async(req,res = response) => {

    const { email} = req.body;
    try {

        let  usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: `Ya existe un usuario registrado con ese correo`
            });
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        usuario.password = hashSync(usuario.password, genSaltSync(10));

        await usuario.save();
        
        //Generar JWT

        const token = await generarJWT(usuario.id, usuario.name);

        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {

        console.log(error);

        if(error.code === 11000){
            return res.status(400).json({
                ok: false,
                msg: `Ya existe un usuario registrado con ese correo`
            });
        };

        
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor. En unos momentos se arreglará'
        });

    }

};

exports.login = async(req,res = response) => {

    const {email, password} = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'No eiste un usuario registrado con este correo'
            });
        };

        if(!compareSync(password, usuario.password)){

            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });

        }

        //Generar JWT

        const token = await generarJWT(usuario.id, usuario.name);

        return res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor. En unos momentos se arreglará'
        });
    }

};

exports.renovarToken = async(req,res = response) => {

    const {uid, name} = req;

    // generar un nuevo JWT

    const token = await generarJWT(uid, name);

    res.status(200).json({
        ok: true,
        uid,
        name,
        token
    });
};