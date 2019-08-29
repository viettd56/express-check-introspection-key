import * as express from 'express';
import { FieldDefinitionNode, parse, visit } from 'graphql';

export const checkIntrospectionKey = (key: string, headerKey: string): express.RequestHandler => {
    return async (req, res, next) => {
        try {
            if (req.body && req.body.query) {
                visit(parse(req.body.query), {
                    enter(node) {
                        if (node.kind === 'Field') {
                            const fieldNode = (node as unknown) as FieldDefinitionNode;
                            if (fieldNode.name.value === '__schema' || fieldNode.name.value === '__type') {
                                const introspectionKey = req.headers[headerKey];
                                if (introspectionKey !== key) {
                                    throw new Error('Introspection key invalid');
                                }
                            }
                        }
                    },
                });
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
