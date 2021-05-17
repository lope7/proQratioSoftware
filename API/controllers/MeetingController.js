import models from '../models';
/** 
 * @module
 */
export default {
    /**
     * Method to add meetings.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    add: async (req, res, next) => {
        try {
            const reg = await models.Meeting.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to make a query and find a meeting.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    query: async (req, res, next) => {
        try {
            const reg = await models.Meeting.findOne({ _id: req.query._id });
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
     * Method to list meetings.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} t 
     */
    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await models.Meeting.find({ $or: [{ 'organiser': new RegExp(value, 'i') }, { 'issue': new RegExp(value, 'i') }] }, { createdAt: 0 })
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
     * Method to update a meeting.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    update: async (req, res, next) => {
        try {
            const reg = await models.Meeting.findByIdAndUpdate({ _id: req.body._id }, { organiser: req.body.organiser, duration: req.body.duration, link: req.body.link, issue: req.body.issue });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to delete cancelled meetings.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    removeMeetings: async (req, res, next) => {
        try {
            const reg = await models.Meeting.deleteMany({ 'status': 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to activa a meeting.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void}  
     */
    activate: async (req, res, next) => {
        try {
            const reg = await models.Meeting.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    },
    /**
     * Method to cancel a meeting.
     * @param {Object} req request to a serve.
     * @param {Object} res indicate whether or not the API call was a success.
     * @param {Function} next invokes the next middleware function.
     * @return {void} 
     */
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Meeting.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Error'
            });
            next(e);
        }
    }
}
