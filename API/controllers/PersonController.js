import models from '../models';
/** 
 * @module
 */
export default {
    /**
     * Method to add people.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    add: async (req, res, next) => {
        try {
            const reg = await models.Person.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to make a query and find a person.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    query: async (req, res, next) => {
        try {
            const reg = await models.Person.findOne({ _id: req.query._id });
            if (!reg) {
                res.status(404).send({
                    message: 'The register doesn´t exist'
                });
            } else {
                res.status(200).json(reg);
            }
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to list people.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }] }, { createdAt: 0 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to list clients.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    clientList: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }], 'type': 'Cliente' }, { createdAt: 0 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to list providers.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    providerList: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }], 'type': 'Proveedor' }, { createdAt: 0 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to list creditors.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    creditorList: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }], 'type': 'Acreedor' }, { createdAt: 0 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to list employees.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    employeeList: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }], 'type': 'Empleado' }, { createdAt: 0 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to update people.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    update: async (req, res, next) => {
        try {
            const reg = await models.Person.findByIdAndUpdate({ _id: req.body._id }, { type: req.body.type, name: req.body.name, document_type: req.body.document_type, document_num: req.body.document_num, address: req.body.address, phone: req.body.phone, email: req.body.email });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to delete inactive people in the company.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    removeAll: async (req, res, next) => {
        try {
            const reg = await models.Person.deleteMany({ 'status': 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to activate a person.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    activate: async (req, res, next) => {
        try {
            const reg = await models.Person.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'error'
            });
            next(e);
        }
    },
    /**
     * Method to deactivate a person.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Person.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    }
}