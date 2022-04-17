const { io } = require('../server');

const { Usuarios } = require('./clases/usuarios');
const { crearMensaje } = require('../utils/utils')

const usuarios = new Usuarios();

io.on('connection', (client) => {
    console.log('Usuario conectado');





    client.on('entrarChat', (usuario, callback) => {
        console.log(usuario);

        if(!usuario.nombre || !usuario.sala) {
            callback({
                error: true,
                mensaje: 'El nombre y sala son necesarios.'
            });
        } else {

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unio...`));

        callback(usuarios.getPersonasPorSala(usuario.sala));
        }
    });

    client.on('crearMensaje', (payload, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, payload.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);

    });


    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio...`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    })



    // mensajes privado
    client.on('mensajePrivado', (payload) => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(payload.para).emit('mensajePrivado', crearMensaje(persona.nombre, payload.mensaje));

    });


});