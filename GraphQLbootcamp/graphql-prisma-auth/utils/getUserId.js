import jwt from 'jsonwebtoken'

const getUserId = (request) => {
    const header = request.headers.get('Authorization')

    if (!header) {
        return
    }

    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, 'thisisasecret')

    return decoded
}

export { getUserId as default }