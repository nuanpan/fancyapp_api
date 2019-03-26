import { Users } from '../models/users.model';

export const createNewUser = (data) => {
    let users = new Users(data);
    return users.save();
}

export const getAllUsers = () => {
    return Users.find({});
}

export const getUserByEmail = (email: string) => {
    return Users.findOne({ email: email.toLowerCase() });
}

export const getUserById = (id: string) => {
    return Users.findOne({ _id: id });
}

export const updateUserById = (id: string, data: any) => {
    return Users.findOneAndUpdate({ _id: id }, data);
}

export const deleteUserById = (id: string) => {
    return Users.deleteOne({ _id: id });
}
