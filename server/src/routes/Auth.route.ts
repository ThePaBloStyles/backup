import { login } from "@controllers/Auth.controller";
import { Router } from "express";

const router = Router()

router.post('/login', login)

export default router