exports.loginRequired = (handler) => {
    return (req, res) => {
        return handler(req, res);
    };
};
