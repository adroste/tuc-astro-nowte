/**
 * @author progmem
 * @date 27.11.17
 */

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
module.exports.asyncMiddleware = asyncMiddleware;