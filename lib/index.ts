import * as express from 'express';
const fss = require('fast-string-search');

export const checkIntrospectionKey = (key: string): express.RequestHandler => {
    return async (req, res, next) => {
        try {
            if (req.body && req.body.query) {
                const query: string = req.body.query;
                if (
                    fss.indexOf(query.toLowerCase(), '__schema') > 0 ||
                    fss.indexOf(query.toLowerCase(), '__type') > 0 ||
                    fss.indexOf(query.toLowerCase(), 'introspectionquery') > 0
                ) {
                    const introspectionKey = req.headers['x-introspection-key'];
                    if (introspectionKey !== key) {
                        throw new Error('Introspection key invalid');
                    }
                }
            }
            next();
        } catch (error) {
            res.send({
                error_code: error.code || -1,
                message: error.message,
            });
        }
    };
};
