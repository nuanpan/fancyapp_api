import { Request, Response } from 'express';
import * as UserModules from '../modules/users.module';
import * as TokenModules from '../modules/token.module';
import * as EncryptModules from '../modules/encrypt.module';
import { comparePassword } from '../modules/encrypt.module';

export default class UsersController {
    public index(req: Request, res: Response, next: Function): void {
        UserModules.getAllUsers().then(result => {
            res.send(result);
        })
    }

    public login(req: Request, res: Response, next: Function): void {
        let email = req.body.email;
        let password = req.body.password;
        let user;
        console.log(req.body);
        UserModules.getUserByEmail(email).then((results) => {
            user = JSON.parse(JSON.stringify(results));
            if (!results) {
                res.send({ code: 200, err_message: 'There\' is no this user in our system please create the new one.' });
            } else {
                return EncryptModules.comparePassword(password, user.password, function (err, result) {
                    console.log("compare result:", result);
                    let resUser = {
                        id: user._id,
                        email: user.email,
                        config: user.config || {}
                    };
                    if (result)
                        return TokenModules.getLoginToken(user).then(tokens => {
                            res.send({ code: 200, data: { token: tokens, users: resUser } });
                        });
                    else res.send({ code: 200, err_message: 'The Email/Password was incorrect.' });
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    public create(req: Request, res: Response, next: Function): void {
        EncryptModules.cryptPassword(req.body.password, function (err, hash) {
            req.body.password = hash;
            UserModules.getUserByEmail(req.body.email).then(user => {
                if (user) {
                    res.send({ code: 200, err_message: "This user has already in db" })
                } else {
                    return UserModules.createNewUser(req.body).then(result => {
                        let resResult = {
                            id: result._id,
                            email: result.email,
                            config: result.config || {}
                        }
                        res.send({ code: 200, data: resResult, message: "Users has been created." });
                    });
                }
            })
        })

    }

    public update(req: Request, res: Response, next: Function): void {
        UserModules.updateUserById(req.params.id, req.body).then(result => {
            res.send({ code: 200, message: "Updated complete." });
        });
    }

    public delete(req: Request, res: Response, next: Function): void {
        console.log(req.params);
        UserModules.deleteUserById(req.params.id).then(result => {
            res.send({ code: 200, message: "Delete user completed." });
        });
    }

    public changePassword(req: Request, res: Response, next: Function): void {
        let oldPassword = req.body.oldPassword;
        let user;
        UserModules.getUserById(req.params.id).then((results) => {
            user = JSON.parse(JSON.stringify(results));
            if (!results) {
                res.send({ code: 200, err_message: 'There\'s no this user' });
            }
            return EncryptModules.comparePassword(oldPassword, results.password, function (err, compareResult) {
                let resUser = {
                    id: user._id,
                    email: user.email,
                    config: user.config || {}
                };
                if (!compareResult)
                    res.send({ code: 200, err_message: 'Old password is not correct.' });

                EncryptModules.cryptPassword(req.body.newPassword, function (err, hash) {
                    let updateData = {
                        password: hash
                    }
                    UserModules.updateUserById(req.params.id, updateData).then(result => {
                        res.send({ code: 200, message: "Your password has been changed." });
                    });
                });
            });
        }).catch(err => {
            console.log(err);
        })

    }
}

export const usersController = new UsersController();