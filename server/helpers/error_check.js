module.exports = {
    checker: function errorCheck(res, item) {
        let msg = `${item} is missing!`;
        console.error(msg);
        res.status(401).json({msg: msg});
    }
};