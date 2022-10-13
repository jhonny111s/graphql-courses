const Post = {
    async author(parent, args, { db, prisma }, info) {
        const id = parseInt(parent.author)
        const user = await prisma.user.findFirst({
            where: {
                id: id,
            }
        })

        return user
    },
    async comments(parent, args, { db, prisma }, info) {
        const userId = parseInt(parent.author)
        const comments = await prisma.comment.findMany({
            where: {
                author: userId
            }
        })

        return comments
    }
}

export { Post as default }