import models from '../models';
/** 
 * @module
 */
export default {
    /**
     * Method to add banks.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    add: async (req, res, next) => {
        try {
            const reg = await models.Bank.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to make a query and find a bank.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    query: async (req, res, next) => {
        try {
            const reg = await models.Bank.findOne({ _id: req.query._id });
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
     * Method to list banks.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Bank.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'address': new RegExp(value, 'i') }] }, { createdAt: 0 })
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
     * Method to update a bank.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    update: async (req, res, next) => {
        try {
            const reg = await models.Bank.findByIdAndUpdate({ _id: req.body._id }, { name: req.body.name, address: req.body.address, phone: req.body.phone, email: req.body.email, link: req.body.link });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to delete inactive banks.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    removeBanks: async (req, res, next) => {
        try {
            const reg = await models.Bank.deleteMany({ 'status': 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to activate a bank.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    activate: async (req, res, next) => {
        try {
            const reg = await models.Bank.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to deactivate a bank.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Bank.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    }
}
