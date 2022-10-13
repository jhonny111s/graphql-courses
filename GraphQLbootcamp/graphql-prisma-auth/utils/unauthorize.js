const isAuthorized = (user) => {


    if (!user) {
        throw new Error('Unauthorized')
    }


    return user.userId
}

export { isAuthorized as default }