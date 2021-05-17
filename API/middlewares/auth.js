import tokenService from '../services/token';
/** 
 * @module
 */
export default {
    /**
     * Method to verify users.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @returns {String}
     */
    verifyUser: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'No token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.role == 'Administrador' || response.role == 'Ventas' || response.role == 'Almacen') {
            next();
        } else {
            return res.status(403).send({
                message: 'Unauthorised'
            });
        }
    },
    /**
     * Method to verify if an user is administrator.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function. 
     * @returns {String}
     */
    verifyAdmin: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'No token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.role == 'Administrador') {
            next();
        } else {
            return res.status(403).send({
                message: 'Unauthorised'
            });
        }
    },
    /**
     * Verify is an user is a warehouse manager.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @returns {String}
     */
    verifyWarehouseManager: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'No token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.role == 'Administrador' || response.role == 'Almacen') {
            next();
        } else {
            return res.status(403).send({
                message: 'Unauthorised'
            });
        }
    },
    /**
     *  Verify is an user is a sales manager.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function. 
     * @returns {String}
     */
    verifySalesManager: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'No token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.role == 'Administrador' || response.role == 'Ventas') {
            next();
        } else {
            return res.status(403).send({
                message: 'Unauthorised'
            });
        }
    },
    /**
     *  Verify is an user is a finance manager.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @returns {String}
     */
    verifyFinanceManager: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'No token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.role == 'Administrador' || response.role == 'Finanzas') {
            next();
        } else {
            return res.status(403).send({
                message: 'Unauthorised'
            });
        }
    },
    /**
     *  Verify is an user is an administrative.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function. 
     * @returns {String}
     */
    verifyRRHH: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'No token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.role == 'Administrador' || response.role == 'RRHH') {
            next();
        } else {
            return res.status(403).send({
                message: 'Unauthorised'
            });
        }
    }
}