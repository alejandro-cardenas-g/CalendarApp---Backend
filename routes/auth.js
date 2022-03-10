//Routes from /api/auth

const {Router} = require('express');
const router = Router();

//AuthController

const { crearUsuario, login, renovarToken } = require('../controllers/authController');

//MiddleWares

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

//ExpressValidator

const { check } = require('express-validator');

router.post('/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({min: 6}),
        validarCampos,
    ],
    crearUsuario
);
router.post('/', 
    [
        check('email','El email es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'La contraseña debe tener mínimo 6 caracteres').not().isEmpty(),
        validarCampos,
    ],
    login
);
router.get('/renew', 
    [
        validarJWT
    ],
    renovarToken
);

module.exports = router;