import { executeLogin } from "../services/Auth.services";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    console.log('🔍 Login attempt received');
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Request headers:', req.headers);
    
    const {email, password} = req.body
    console.log('📧 Email:', email, '🔐 Password:', password ? '[PROVIDED]' : '[MISSING]')
    
    try {
        const response = await executeLogin(email, password)
        console.log('✅ Login response:', response);
        if (response.state) {
            res.status(response.status).json(response)
        } else {
            res.status(response.status).json(response)
        }
    } catch (error) {
        console.log('❌ Login error:', error);
        res.status(400).json(error)
    }
}