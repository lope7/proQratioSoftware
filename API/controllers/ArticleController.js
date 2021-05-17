import models from '../models';
/** 
 * @module
 */
export default {
    /**
     * Method to add articles.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    add: async (req, res, next) => {
        try {
            const reg = await models.Article.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to make a query and find an article.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    query: async (req, res, next) => {
        try {
            const reg = await models.Article.findOne({ _id: req.query._id })
                .populate('categorie', { name: 1 });
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
     * Method to list articles.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Article.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'description': new RegExp(value, 'i') }] }, { createdAt: 0 })
                .populate('categorie', { name: 1 })
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
     * Method to update articles.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    update: async (req, res, next) => {
        try {
            const reg = await models.Article.findByIdAndUpdate({ _id: req.body._id }, { categorie: req.body.categorie, code: req.body.code, name: req.body.name, description: req.body.description, pvp: req.body.pvp, stock: req.body.stock });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to delete inactive articles.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    removeArticles: async (req, res, next) => {
        try {
            const reg = await models.Article.deleteMany({ 'status': 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to activate an article.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    activate: async (req, res, next) => {
        try {
            const reg = await models.Article.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to deactivate an article.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Article.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to find an article by its bar code.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    queryBarCode: async (req, res, next) => {
        try {
            const reg = await models.Article.findOne({ code: req.query.code })
                .populate('categorie', { name: 1 });
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
    }
}
