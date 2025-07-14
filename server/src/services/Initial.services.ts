import clientModel from "@/models/Client.model"
/* import { UserProject } from "../interface" */
import bcrypt from 'bcrypt'
import roleModel from "@/models/Role.model"
import userModel from "@/models/User.model"

export const initializeAdminDatabase = async () => {
    try {
        const findOrg = await clientModel.findOne({name: 'KAUEL'})
        if (!findOrg) {
            const newOrg = await clientModel.create(
                {
                    name: process.env.ORG_NAME
                }
            )

            console.log('Client ', `${newOrg.name}`, ' created.')

            const findRoleAdmin = await roleModel.findOne({name: process.env.ROLE_NAME})
            console.log(newOrg)
            if (!findRoleAdmin && newOrg) {
                const newRole = {
                    name: process.env.ROLE_NAME,
                    client: newOrg.id
                }
                console.log(newRole)
                const createRoleSuperAdmin = await roleModel.create(newRole)
                console.log('Role ', `${createRoleSuperAdmin.name}`, ' created.')

                const findSuperAdmin = await userModel.find({
                    roles: [createRoleSuperAdmin.id]
                })

                if (findSuperAdmin.length === 0 && createRoleSuperAdmin) {
                    const hashedPassword = await bcrypt.hash(process.env.PASSWORD_ADMIN, 10)
                    
                    const newSuperAdmin = await userModel.create({
                        name: process.env.NAME_ADMIN,
                        lastName: process.env.LASTNAME_ADMIN,
                        email: process.env.EMAIL_ADMIN,
                        password: hashedPassword,
                        roles:[createRoleSuperAdmin.id],
                        clients: [newOrg.id]
                    })
                    console.log('Super Admin ', `${newSuperAdmin.name} ${newSuperAdmin.lastName}`, ' created.')
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}