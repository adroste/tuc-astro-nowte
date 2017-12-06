/**
 * @author progmem
 * @date 27.11.17
 */


/**
 * Utilities for API-Routes
 */
class RoutesUtil {

    /**
     * Wrapper for express routes to handle rejected promises
     * @param {function(req: *, res: *, next:*)} fn (async) express route handler
     */
    static asyncMiddleware(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        };
    }
}


module.exports = RoutesUtil;