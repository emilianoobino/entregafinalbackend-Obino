class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({}, 'username email role')
            res.json({ users })
        } catch (error) {
            logger.error("Error getting users:", error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async changeUserRole(req, res) {
        try {
            const { uid } = req.params
            const user = await UserModel.findById(uid)

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const requiredDocuments = ['Proof of account status.pdf']
            const userDocuments = user.documents.map(doc => doc.name)
            const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc))

            if (!hasRequiredDocuments) {
                return res.status(400).json({ message: 'The user must upload the required documents' })
            }

            const newRole = user.role === 'user' ? 'premium' : 'user'
            const updatedUser = await UserModel.findByIdAndUpdate(uid, { role: newRole }, { new: true })

            res.status(200).json({ updatedUser })
        } catch (error) {
            logger.error('Error changing user role:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async deleteUser(req, res) {
        const { uid } = req.params
        try {
            const user = await UserModel.findById(uid)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            await emailServices.sendUserDeletionEmail(user.email, user.first_name, user.last_name)
            await CartModel.findByIdAndDelete(user.cart)
            await UserModel.findByIdAndDelete(uid)

            res.status(200).json({ message: 'User deleted successfully', user })
        } catch (error) {
            logger.error('Error deleting user:', error)
            res.status(500).json({ message: 'Error deleting user' })
        }
    }

    async deleteInactiveUsers(req, res) {
        try {
            const thresholdDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Últimos 2 días
            const inactiveUsers = await UserModel.find({ last_connection: { $lt: thresholdDate } })

            if (inactiveUsers.length === 0) {
                return res.status(404).json({ message: 'No inactive users found' })
            }

            for (const user of inactiveUsers) {
                await emailServices.sendUserInactivityDeletionEmail(user.email, user.first_name, user.last_name)
                await CartModel.findByIdAndDelete(user.cart)
                await UserModel.findByIdAndDelete(user._id)
            }

            res.status(200).json({ message: `${inactiveUsers.length} inactive users deleted` })
        } catch (error) {
            logger.error('Error deleting inactive users:', error)
            res.status(500).json({ message: 'Error deleting inactive users' })
        }
    }

    // Funciones para usuarios
    async register_validate(req, res, next) {
        try {
            const { username, email } = req.body
            const errors = {}

            const existingUser = await UserModel.findOne({ $or: [{ username: username }, { email: email }] })

            if (existingUser?.username || username === admin_username) {
                errors.username = 'The username is already registered'
            }

            if (existingUser?.email || email === admin_email) {
                errors.email = 'The email address is already registered'
            }

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors })
            }
            next()
        } catch (error) {
            logger.error('Error in register_validate:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async register(req, res) {
        try {
            const { username, first_name, last_name, email, password, age, role, forTesting } = req.body
            const errors = {}

            const existingUser = await UserModel.findOne({ $or: [{ username: username }, { email: email }] })

            if (existingUser?.username || username === admin_username) {
                errors.username = 'The username is already registered'
            }

            if (existingUser?.email || email === admin_email) {
                errors.email = 'The email address is already registered'
            }

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors })
            }

            const newCart = await cartServices.createCart()

            const newUser = {
                username,
                first_name,
                last_name,
                email,
                password: createHash(password),
                age,
                role,
                cart: newCart._id,
                forTesting
            }

            await UserModel.create(newUser)
            res.render('registerSuccess', { title: 'Register Success' })
        } catch (error) {
            logger.error('Error in register:', error)
            res.status(500).send({ message: 'Error in register' })
        }
    }

    async login_validate(req, res, next) {
        try {
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email })
            const errors = {}

            const adminUser = {
                username: admin_username,
                first_name: admin_data,
                last_name: admin_data,
                email: admin_email,
                password: admin_password,
                age: admin_data,
                role: admin_role
            }

            if (email === adminUser.email && password === adminUser.password) {
                const token = jwt.sign({ user: adminUser }, secret_cookie_token, { expiresIn: '1h' })
                res.cookie('cookieAppStore', token, {
                    maxAge: 3600000,
                    httpOnly: true
                })
                return res.redirect('/realtimeproducts')
            }

            if (user) {
                if (user.email !== email || !isValidPassword(password, user)) {
                    errors.email = 'The email address or password are incorrect'
                    errors.password = 'The email address or password are incorrect'
                }
            } else {
                errors.email = 'The email address or password are incorrect'
                errors.password = 'The email address or password are incorrect'
            }

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors })
            }
            next()
        } catch (error) {
            logger.error('Error in login_validate:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email })

            const adminUser = {
                username: admin_username,
                first_name: admin_data,
                last_name: admin_data,
                email: admin_email,
                password: admin_password,
                age: admin_data,
                role: admin_role
            }

            if (email === adminUser.email && password === adminUser.password) {
                const token = jwt.sign({ user: adminUser }, secret_cookie_token, { expiresIn: '1h' })
                res.cookie('cookieAppStore', token, {
                    maxAge: 3600000,
                    httpOnly: true
                })
                return res.redirect('/realtimeproducts')
            }

            if (!user || !isValidPassword(password, user)) {
                return res.status(400).json({ message: 'The email address or password are incorrect' })
            }

            const token = jwt.sign({ user }, secret_cookie_token, { expiresIn: '1h' })
            res.cookie('cookieAppStore', token, {
                maxAge: 3600000,
                httpOnly: true
            })

            res.redirect('/realtimeproducts')
        } catch (error) {
            logger.error('Error in login:', error)
            res.status(500).json({ message: 'Error in login' })
        }
    }

    async logout(req, res) {
        try {
            req.logout(error => {
                if (error) {
                    logger.error('Error in logout:', error)
                    res.status(500).json({ message: 'Error in logout' })
                } else {
                    res.clearCookie('cookieAppStore')
                    res.redirect('/login')
                }
            })
        } catch (error) {
            logger.error('Error in logout:', error)
            res.status(500).json({ message: 'Error in logout' })
        }
    }

    async currentSession(req, res) {
        try {
            const { user } = req.user
            res.json({ user })
        } catch (error) {
            logger.error('Error in currentSession:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}

export default new UserController()


