const User = {
    async posts(parent, args, { db, prisma }, info) {

        const userId = parseInt(parent.id)
        const posts = await prisma.post.findMany({
            where: {
                author: userId,
            }
        })

        return posts
    },
    async comments(parent, args, { db, prisma }, info) {
        const userId = parseInt(parent.id)
        const posts = await prisma.comment.findMany({
            where: {
                author: userId,
            }
        })

        return posts

    }
}

export { User as default }