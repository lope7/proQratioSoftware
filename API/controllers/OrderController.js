import models from '../models';
/**
 * Method to increase the stock because of an order.
 * @param {Number} idarticle identifier of the article.
 * @param {Number} amount item units.
 */
async function increaseStock(idarticle, amount) {
    let { stock } = await models.Article.findOne({ _id: idarticle });
    let newStock = parseInt(stock) + parseInt(amount);
    const reg = await models.Article.findByIdAndUpdate({ _id: idarticle }, { stock: newStock });
}
/**
 * Method to decrease the stock beacuase of an order.
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
     * Method to add orders.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    add: async (req, res, next) => {
        try {
            const reg = await models.Order.create(req.body);
            //Update stock
            let details = req.body.details;
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
     * Method to make a query and find an order.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    query: async (req, res, next) => {
        try {
            const reg = await models.Order.findOne({ _id: req.query._id })
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
     * Method to list orders.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Order.find({ $or: [{ 'number_proof': new RegExp(value, 'i') }, { 'serial_proof': new RegExp(value, 'i') }] })
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
     * Method to activate an order.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    activate: async (req, res, next) => {
        try {
            const reg = await models.Order.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
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
     * Method to cancel an order.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Order.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
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
     * Method to make a query and find an order by date.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    queryDate: async (req, res, next) => {
        try {
            let start = req.query.start;
            let end = req.query.end;
            const reg = await models.Order.find({ "createdAt": { "$gte": start, "$lt": end } })
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
    * Method to delete cancelled orders.
    * @param {Object} req request to a serve.
    * @param {Object} res indicate whether or not the API call was a success.
    * @param {Function} next invokes the next middleware function.
    * @return {void} 
    */
    removeOrders: async (req, res, next) => {
        try {
            const reg = await models.Order.deleteMany({ 'status': 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    }
}