import { Router, Request, Response, NextFunction } from "express";
import { usersController } from '../controllers/users.controller';
import { Users } from '../models/users.model';


export class UsersRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.router.get("/", usersController.index);
		this.router.post("/login", usersController.login);
		this.router.post("/create", usersController.create);
		this.router.put("/changepassword/:id", usersController.changePassword)
		this.router.put("/:id", usersController.update);
		this.router.delete("/:id", usersController.delete);
	}
}
const UsersRoute = new UsersRouter().router;

export default UsersRoute;