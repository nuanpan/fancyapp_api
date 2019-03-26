import { Schema, Model, model, Document } from 'mongoose';
import * as mongoose from "mongoose";

export interface IToken extends Document {
    userId: string;
    token: string;
    keys: string;
    expiredDate: Date;
}

export var TokenSchema: Schema = new Schema(
    {
        userId: mongoose.Schema.Types.ObjectId,
        token: String,
        keys: String,
        expiredDate: Date
    },{
        versionKey: false,
        collection: "loginTokens"
    }
);

export const Tokens: Model<IToken> = model<IToken>('Tokens', TokenSchema);
