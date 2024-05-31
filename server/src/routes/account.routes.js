import {Router} from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { deleteAccount } from "../controllers/account.controller.js";

const router = Router();

router.post("/delete", verifyJwt, deleteAccount )


export default router;