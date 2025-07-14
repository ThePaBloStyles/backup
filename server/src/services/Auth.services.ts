import { __ } from "i18n"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { HttpException } from "../exceptions/HttpException"
import { languageDefault, secretKey } from "../configs/env"
/* import { Role, DataStoredInToken, TokenData, UserProject } from "../interface" */
import { isEmpty } from "@/utils/util"
import userModel from "@/models/User.model"
import { UserProject } from "@/interfaces/User.interface"
import { Role } from "@/interfaces/Role.interface"
import { DataStoredInToken, TokenData } from "@/interfaces/Auth.interface"


export const executeLogin = async (email: string, password: string, locale: string = languageDefault!) => {
    if (isEmpty(email) || isEmpty(password)) throw new HttpException(400, __({ phrase: 'Credentials are required', locale }))

    const findUser: UserProject = await userModel.findOne({ email: email })
    if (!findUser) {
        return {message: __({ phrase: 'Email {{email}} not found', locale }, { email: email }), status: 410, state: false}
    }

    const isPasswordMatching: boolean = await bcrypt.compare(password, findUser.password)
    if (!isPasswordMatching) {
        return {message: __({ phrase: 'Wrong password', locale }), status: 409, state: false}
    }

    const token = createToken(findUser, 86400)
    const cookie = createCookie(token)
    return { cookie, findUser, token, message: 'login ok', status: 200, state: true }
}

const createToken = (user: UserProject, expiresIn = 3600) => {
    const dataStoredInToken: DataStoredInToken = { _id: user._id } // user._id, [clientId, resources]
    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) }
}

export const verifyToken = (token: string, ignoreExpiration = false) => {
    return jwt.verify(token, secretKey, { ignoreExpiration }) as DataStoredInToken
}

const createCookie = (tokenData: TokenData) => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
}
