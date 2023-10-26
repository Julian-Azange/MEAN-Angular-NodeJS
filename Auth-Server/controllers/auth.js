const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async ( req, res = response ) => {

    const { email, name, password } = req.body;

    try {

        // Verificar el email que no exista en la base de datos
        let usuario = await Usuario.findOne({ email });
        
        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );


        // Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );


        // Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        // Crear nuevo usuario en la DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            email,
            name,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status( 500 ).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    
} 

const loginUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        //TODO aca podemos grabar los log de acceso del usuario, etc
        const dbUser = await Usuario.findOne( { email } );
        
        // CONFIRMAMOS SI EL USUARIO HACE MATCH
        if( !dbUser ) {
            
            return res.status(400).json({
                ok: false,
                //TODO: Habilitar el segundo comentario y deshabilitar el primero
                msg: 'El correo no existe.',
                //msg: 'Credenciales no son válidas.'
            })
            
        }

        // CONFIRMAMOS SI EL PASSWORD HACE MATCH
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        //const dbUser = await Usuario.findOne({ password });

        if ( !validPassword ){

            return res.status(400).json({
                ok: false,
                //TODO: Habilitar el segundo comentarios y deshabilitar el primero
                msg: 'El password no es correcto',
                //msg: 'Credenciales no son válidas'
            })
        }

        // GENERAR EL JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        // RESPUESTA DEL SERVICIO
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable y notifique esto a un administrador.'
        });
    }

}

/*
const revalidarToken = async ( req, res = response ) => {

    // OBTENER DATOS DE USUARIO ACTUAL
    const { uid } = req;

    // Leer la base de datos
    const dbUser = await Usuario.findById(uid);

    if ( !dbUser ) {
        return res.status(400).json({
            ok: false,
            msg: 'Problemas con la validación del uid, éste no existe en la base de datos.'
        })
    }

    // GENERAR EL JWT
    const token = await generarJWT( uid, dbUser.name );
    
    // RESPONDER AL CLIENTE CON STATUS 200 Y EL OBJETO COMPLETO
    return res.json({
        ok: true,
        name: dbUser.name,
        email: dbUser.email,
        uid,
        token
    })
}*/

const revalidarToken = async (req, res = response) =>{

    const { uid } = req;

    //Leer la base de datos
    const dbUser = await Usuario.findById( uid );

    // GENERAR EL JWT
    const token = await generarJWT( uid, dbUser.name );

    return res.json({
        ok: true,
        uid,
        name: dbUser.name, 
        email: dbUser.email,
        token
    });
}

module.exports = { crearUsuario, loginUsuario, revalidarToken }