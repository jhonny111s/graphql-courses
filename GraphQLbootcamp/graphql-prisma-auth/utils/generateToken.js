import jwt from 'jsonwebtoken'

const generateToken = (data) => {
    return jwt.sign(data, 'thisisasecret', { expiresIn: '7 days' })
}

export { generateToken as default }