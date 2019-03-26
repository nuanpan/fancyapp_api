import { Schema, Model, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    config: Object;
    name: string;
    isActive: boolean;
    creted: Date;
}


export interface IUserModel extends IUser, Document { }

export var UserSchema: Schema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    config: {
        type: Object
    },
    isActive: {
        type: Schema.Types.Boolean
    },
    created: {
        type: Schema.Types.String,
        default: Date.now()
    }
}, {
        versionKey: false,
        collection: "users"
    }
);

export type UsersModel = Model<IUser> & IUserModel & IUser;

export const Users: Model<IUser> = model<IUser>('Users', UserSchema);
