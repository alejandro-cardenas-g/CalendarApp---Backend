/*
    Event Routes from /api/events
*/

const {response} = require('express');

//Modelo

const Evento = require('../models/Evento');

//Acciones

exports.getEventos = async(req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    });

};

exports.crearEvento = async(req, res = response) => {

    try {

        const evento = new Evento(req.body);

        evento.user = req.uid;

        const EventoGuardado = await evento.save();

        return res.status(201).json({
            ok: true,
            evento: EventoGuardado
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor. En unos momentos se arreglará'
        });
    };

};

exports.actualizarEvento = async(req, res = response) => {

    const eventId = req.params.id;
    const { uid } = req;

    try {
        
        const evento = await Evento.findById(eventId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            });
        };

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos de editar este evento'
            });
        };

        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate(eventId, nuevoEvento, {new: true});

        return res.status(200).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor. En unos momentos se arreglará'
        });
    }

};

exports.eliminarEvento = async(req, res = response) => {

    const eventId = req.params.id;
    const { uid } = req;

    try {

        const evento = await Evento.findById(eventId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            });
        };

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos de eliminar este evento'
            });
        };

        await Evento.findByIdAndDelete(eventId);

        return res.status(200).json({
            ok: true
        });

        
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor. En unos momentos se arreglará'
        });
    }

};