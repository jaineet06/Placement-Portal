import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decodedToken
        next()
    } catch (error) {
        res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
}

export { authUser }