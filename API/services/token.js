import jwt from 'jsonwebtoken';
import models from '../models';

/**
 * Method to check the user token.
 * @param {Object} token Generated user token when login.
 */
async function checkToken(token) {
    let __id = null;
    try {
        const { _id } = await jwt.decode(token);
        __id = _id;
    } catch (e) {
        return false;
    }
    const user = await models.User.findOne({ _id: __id, status: 1 });
    if (user) {
        const token = jwt.sign({ _id: __id }, 'secretpasswordtogeneratetoken', { expiresIn: '1d' });
        return { token, role: user.role };
    } else {
        return false;
    }
}
/** 
 * @module
 */
export default {
    /**
     * Method to encode the user token.
     * @param {Number} _id User identifier.
     * @param {String} role User role in the company.
     * @param {String} email User email.
     */
    encode: async (_id, role, email) => {
        const token = jwt.sign({ _id: _id, role: role, email: email }, 'secretpasswordtogeneratetoken', { expiresIn: '1d' });
        return token;
    },
    /**
     * Method to decode the user token.
     * @param {Object} token User token generated when login.
     * @returns User
     */
    decode: async (token) => {
        try {
            const { _id } = await jwt.verify(token, 'secretpasswordtogeneratetoken');
            const user = await models.User.findOne({ _id, status: 1 });
            if (user) {
                return user;
            } else {
                return false;
            }
        } catch (e) {
            const newToken = await checkToken(token);
            return newToken;
        }
    }
}