import * as crypto from "crypto";
import * as jwt from 'jsonwebtoken';
import { Tokens } from '../models/token.model';
const secret = "a89023480j";

export const getLoginToken = (user) => {
    console.log(user._id);
    return new Promise((resolve, reject) => {
        let token;
        let query;
        genLoginToken().then((keys) => {
            token = jwt.sign({ _id: user._id, email: user.email }, secret + keys);
            query = { userId: user._id, token: token, keys: keys, expiredDate: getExpireDate() };
            return getTokenByUid(user._id);
        }).then((token) => {
            if (token) {
                return updateTokenByUid(user._id, query);
            } else {
                return createToken(query);
            }
        }).then(result => {
            resolve(token);
        }).catch((err) => {
            reject(err || "getLoginToken error.");
        });
    });
}

export const verifyLoginToken = (sToken) => {
    return new Promise((resolve, reject) => {
        let token;
        let decoded;
        getToken(sToken).then((tokenRes) => {
            tokenRes = JSON.parse(JSON.stringify(tokenRes));
            if (!tokenRes) throw ('Token Expired.');
            if (tokenRes.expiredDate < new Date()) throw ('Token Expired.');
            token = tokenRes;
            return decodeToken(token);
        }).then((decodedRes) => {
            decoded = decodedRes;
            return updateToken(decoded.id, { expiredDate: getExpireDate() });
        }).then((update) => {
            resolve(decoded);
        }).catch((err) => {
            reject(err || "verifyLoginToken error.");
        });
    });
}

const decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token.token, secret + token.keys, (err, decoded) => {
            if (err) reject("No Authorization.");
            else resolve(decoded);
        });
    });
}

const getExpireDate = () => {
    let expiredDate = new Date();
    expiredDate.setHours(expiredDate.getHours() + 1);
    return expiredDate;
}


export const genTokenKeys = () => {
    return genKeys(16, 'hex');
}

export const genLoginToken = () => {
    return genKeys(16, 'hex');
}

const genKeys = (number, type) => {
    return new Promise((resolve) => {
        crypto.randomBytes(number, function (err, buffer) {
            let token = buffer.toString(type);
            resolve(token);
        });
    });
}

export const getTokenByUid = (uid: string) => {
    return Tokens.findOne({ userId: uid })
}

export const updateTokenByUid = (uid: string, token: string) => {
    return Tokens.findOneAndUpdate({ userId: uid }, token);
}

export const createToken = (data) => {
    let tokens = new Tokens(data);
    return tokens.save();
}

export const getToken = (token) => {
    return Tokens.findOne({ token: token });
}

export const updateToken = (uid: string, data: any) => {
    return Tokens.findOneAndUpdate({ userId: uid }, data);
}
