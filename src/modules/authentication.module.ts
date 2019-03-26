import * as TokenModules from "../modules/token.module";

export const authentication = () => {
    return (req, res, next) => {
        if (authenticate(req)) {
            req.user = {};
            next();
        }
        else {
            const token = ensureAuthorized(req.headers.authorization);
            TokenModules.verifyLoginToken(token).then((user: any) => {
                req.user = user;
                next();
            }).catch(err => {
                res.status(403).send({
                    success: false,
                    message: err || 'authentication error.'
                });
            });
        }
    }
}

const ensureAuthorized = (authorization) => {
    var bearerToken = "";
    const bearerHeader = authorization;
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        if (bearer[0] === "Bearer" && bearer.length > 1) {
            bearerToken = bearer[1];
        }
    }
    return bearerToken;
}

const authenticate = (req) => {
    console.log("method: ", req.method);
    return req.method === 'OPTIONS'
        || (req.path.startsWith('/users/login'))
        || (req.method === 'GET' && (
             (req.path.startsWith('/api/v1/users') 
        )))
        || (req.method === 'POST' && (
            req.path === '/users/login'
            || req.path === '/users/create'
            || req.path === '/users'
        ))
        || (req.method === 'PUT' && (
            (req.path.startsWith('/users/changepassword'))
        ||  (req.path.startsWith('/users'))
        ))
        || (req.method === 'DELETE' ||
             (req.path.startsWith('/users/')) &&
            false
        )
}