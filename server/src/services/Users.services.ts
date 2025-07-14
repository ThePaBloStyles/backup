import bcrypt from 'bcrypt'
import { UserProject } from '@/interfaces/User.interface'
import userModel from '@/models/User.model'

export const findAllUsers = async () => {
    const users = await userModel.find({state: true})
    return users
}

export const createUser = async (userData: UserProject) => {
    const newUser = {
        ...userData,
        password: encriptPassword(userData.password)
    }
    const user = await userModel.create(newUser)
    return user
}

const encriptPassword = (password: string) => {
    const hashPassword = bcrypt.hashSync(password!, 10)
    return hashPassword
}