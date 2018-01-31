/**
 * @author progmem
 * @date 11.12.17
 */


/**
 * Static class for providing helper methods for file actions
 */
class FileUtil {
    /**
     * Returns all subpaths of a given path
     * @example
     * Input: '/1/2/3/'
     * Output: ['/', '/1/', '/1/2/', '/1/2/3/']
     *
     * @param {string} path valid path, e.g. "/1/2/3/" (needs to start and end with '/')
     * @returns {string[]} subpaths as array
     */
    static getAllSubpaths(path) {
        const subpaths = [];
        let i = 1;
        do {
            subpaths.push(path.slice(0, i));
            i = path.indexOf('/', i) + 1;
        } while (i > 0);
        return subpaths;
    }
}

module.exports = FileUtil;