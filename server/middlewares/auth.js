import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.cookies

    if (!token) {
        return res.json({ success: false, message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decodedToken
        next()
    } catch (error) {
        res.json({ success: false, message: 'Invalid or expired token' });
    }
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.json({ success: false, message: 'Not Authorised' });
        }
        next()
    }
}

export { authUser, authorizeRoles }