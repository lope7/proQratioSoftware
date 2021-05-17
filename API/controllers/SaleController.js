import models from '../models';
/**
 * Method to increase the stock because of the sale.
 * @param {Number} idarticle identifier of the article.
 * @param {Number} amount item units.
 */
async function increaseStock(idarticle, amount) {
    let { stock } = await models.Article.findOne({ _id: idarticle });
    let newStock = parseInt(stock) + parseInt(amount);
    const reg = await models.Article.findByIdAndUpdate({ _id: idarticle }, { stock: newStock });
}
/**
 * Method to decrease the stock beacuse of the sale.
 * @param {Number} idarticle identifier of the article.
 * @param {Number} amount item units. 
 */
async function decreaseStock(idarticle, amount) {
    let { stock } = await models.Article.findOne({ _id: idarticle });
    let newStock = parseInt(stock) - parseInt(amount);
    const reg = await models.Article.findByIdAndUpdate({ _id: idarticle }, { stock: newStock });
}
/** 
 * @module
 */
export default {
    /**
     * Method to add sales.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    add: async (req, res, next) => {
        try {
            const reg = await models.Sale.create(req.body);
            //Update stock
            let details = req.body.details;
            details.map(function (x) {
                decreaseStock(x._id, x.amount);
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to make a query and find a sale.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    query: async (req, res, next) => {
        try {
            const reg = await models.Sale.findOne({ _id: req.query._id })
                .populate('user', { name: 1 })
                .populate('person', { name: 1 });
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
     * Method to list sales.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Sale.find({ $or: [{ 'number_proof': new RegExp(value, 'i') }, { 'serial_proof': new RegExp(value, 'i') }] })
                .populate('user', { name: 1 })
                .populate('person', { name: 1, document_num: 1, address: 1, email: 1, phone: 1 })
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
     * Method to activate a sale.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    activate: async (req, res, next) => {
        try {
            const reg = await models.Sale.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            //Update stock
            let details = reg.details;
            details.map(function (x) {
                decreaseStock(x._id, x.amount);
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to cancel a sale.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Sale.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            //Update stock
            let details = reg.details;
            details.map(function (x) {
                increaseStock(x._id, x.amount);
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to make a query and find a sale.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    queryDate: async (req, res, next) => {
        try {
            let start = req.query.start;
            let end = req.query.end;
            const reg = await models.Sale.find({ "createdAt": { "$gte": start, "$lt": end } })
                .populate('user', { name: 1 })
                .populate('person', { name: 1 })
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
    * Method to delete cancelled sales.
    * @param {Object} req request to a serve.
    * @param {Object} res indicate whether or not the API call was a success.
    * @param {Function} next invokes the next middleware function.
    * @return {void} 
    */
    removeOrders: async (req, res, next) => {
        try {
            const reg = await models.Sale.deleteMany({ 'status': 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    }
}