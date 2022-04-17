var params = new URLSearchParams(window.location.search);

const nombre = params.get('nombre');
const sala = params.get('sala');


// referencia de jQuery
const divUsuarios = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const divChatbox = $('#divChatbox');



// funciones para renderizar usuarios


const renderizarUsuario = (personas = []) => { // [{},{}]

    console.log(personas);

    let html = '';

    html += `<li>
        <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('nombre')}</span></a>
    </li>`;

    for (let i = 0; i < personas.length; i++) {
        
        html += `<li>
            <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre}</span></a> <small class="text-success">online</small></span></a>
        </li>`;

    }

    divUsuarios.html(html);
}


const renderizarMensajes = (mensaje = {}, yo) =>{

    const fecha = new Date(mensaje.fecha);
    const hora = fecha.getHours() + ':' + fecha.getMinutes(); 

    let adminClass = 'info';

    if(mensaje.nombre === 'Administrador') { 
        adminClass = 'danger'
    }


    if(yo){
        html = `<li class="reverse">
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
            </div>
            <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
            <div class="chat-time">${hora}</div>
        </li>`;
    } else {

        let divImg = '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        if(mensaje.nombre == 'Administrador') { 
            divImg = ''
        }

        html = `<li class="animate fadeIn">
            ${divImg}
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
            </div>
            <div class="chat-time">${hora}</div>
        </li>`
    }

    divChatbox.append(html);
}


const scrollBottom = () => {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



// listener

divUsuarios.on('click', 'a', function (){
    
    let id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(event){

    event.preventDefault();

    if (txtMensaje.val().trim().length === 0) return;


    // Enviar información
    socket.emit('crearMensaje', {
        nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        console.log('respuesta server: ', mensaje);
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

});



