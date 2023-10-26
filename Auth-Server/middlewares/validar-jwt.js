const { response } = require("express")
const jwt = require('jsonwebtoken');


const validarJWT = ( req, res = response, next ) => {

    //LEER EL X-TOKEN DEL HEADER
    const token = req.header('x-token');
    
    // VERIFICAMOS QUE VENGA EL TOKEN
    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'token inválido. Verifique su key!'
        })
    }

    try {
      
        // VERIFICAMOS EL TOKEN
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        
        // GUARDAMOS UID Y NAME EN NUESTRO REQ
        req.uid = uid;
        req.name = name;
        
        //console.log(uid, name);
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

    // TODO OK!
    next();

}

module.exports = {
    validarJWT
}