const { Router } = require('express');
const {check} = require('express-validator');
const router = Router();

//Controlador

const { getEventos,crearEvento,actualizarEvento,eliminarEvento } = require('../controllers/eventController');

//Middlewares

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

//Aplicar middleware a todas las rutas

router.use(validarJWT);

//Rutas

router.get('/' ,getEventos);
router.post('/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento
);
router.put('/:id',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento
);
router.delete('/:id', eliminarEvento)

module.exports = router;