const filterObj = require('./utils').filterObj;
const filterQueries = require('./utils').filterQueries;

exports.indexFactory = (model) => {
    return (req, res) => {
        const params = req.query;
        const orderBy = params.order_by || 'order';
        const desc = params.desc;
        const page = parseInt(params.pageNo, 10) - 1 || 0;
        const limit = parseInt(params.pageSize, 10) || 50;
        const queries = filterQueries(params);

        var sortCond = {};

        if (orderBy) {
            sortCond[orderBy] = desc ? -1 : 1;
        }

        model.count({}, (err, count) => {
            if (err) {
                return res.send({status: false, err});
            }

            var statement = model.find(queries.and);

            if (queries.or.length) {  // Disallow empty array.
                statement = statement.or(queries.or);
            }

            statement.sort(sortCond)
                .limit(limit)
                .skip(limit * page)
                .lean()
                .exec((err, result) => {
                    if (err) {
                        return res.send({status: false, err});
                    }
                    return res.send({status: true, records: result, length: count});
                });
        });

    };
};

exports.createFactory = (model, incrementHandler) => {
    return (req, res) => {
        const options = filterObj(req.body);
        const obj = new model(options);

        model.count({}, (err, count) => {
            if (err) {
                return res.send({status: false, err});
            }
            if (incrementHandler) {
                incrementHandler(obj, count);
            }
            obj.save((err, result) => {
                if (err) {
                    return res.send({status: false, err});
                }
                return res.send({status: true, result});
            });
        });
    };
};

exports.detailFactory = (model) => {
    return (req, res) => {
        const objId = req.params.id;
        model.findOne({_id: objId}, (err, result) => {
            if (err) {
                return res.send({status: false, err});
            }
            return res.send({status: true, result});
        });
    };
};

exports.updateFactory = (model) => {
    return (req, res) => {
        const options = filterObj(req.body);
        const objId = req.params.id;
        model.findOneAndUpdate({_id: objId}, options, {new: true}, (err, result) => {
            if (err) {
            return res.send({status: false, err});
            }
            return res.send({status: true, result});
        });
    }
}

exports.upwardFactory = (model) => {
    return (req, res) => {
        const objId = req.params.id;
        model.findOne({ _id: objId }, (err, obj) => {
            if (err) {
                return res.send({ status: false, err });
            }
            model.find({}).sort({ order: -1 }).findOne({ order: { $lt: obj.order } }, (err, prevObj) => {
                if (err) {
                    return res.send({ status: false, err });
                }
                if (!prevObj) {
                    return res.send({ status: true });
                }
                const prevObjOrder = prevObj.order;
                prevObj.order = obj.order;
                prevObj.save((err) => {
                    if (err) {
                        return res.send({ status: false, err });
                    }
                    obj.order = prevObjOrder;
                    obj.save((err) => {
                        if (err) {
                            return res.send({ status: false, err });
                        }
                        return res.send({ status: true });
                    });
                });
            });
        });
    };
};

exports.downwardFactory = (model) => {
    return (req, res) => {
        const objId = req.params.id;
        model.findOne({_id: objId}, (err, obj) => {
            if (err) {
            return res.send({status: false, err});
            }
            model.find({}).sort({order: 1}).findOne({order: {$gt: obj.order}}, (err, nextObj) => {
            if (err) {
                return res.send({status: false, err});
            }
            if (!nextObj) {
                return res.send({status: true});
            }
            const nextObjOrder = nextObj.order;
            nextObj.order = obj.order;
            nextObj.save((err) => {
                if (err) {
                return res.send({status: false, err});
                }
                obj.order = nextObjOrder;
                obj.save((err) => {
                if (err) {
                    return res.send({status: false, err});
                }
                return res.send({status: true});
                });
            });
            });
        });
    };
};
