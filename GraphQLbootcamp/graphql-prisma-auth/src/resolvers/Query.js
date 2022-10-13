import isAuthorized from "../../utils/unauthorize";

const Query = {
    async users(parent, args, { db, prisma, user }, info) {
        console.log(args);

        const pagination = {
            cursor: args.after ? { id: args.after } : undefined,
            take: args.first,
            skip: args.skip,

        }

        if (!args.query) {
            return await prisma.user.findMany({ ...pagination });
        }

        return prisma.user.findMany({
            where: {
                name: args.query.toLowerCase()
            },
            ...pagination
        })
    },
    async posts(parent, args, { db, prisma, user }, info) {
        //isAuthorized(user)

        if (!args.query) {
            return await prisma.post.findMany({
                where: {
                    published: {
                        equals: true,
                    }
                },
                orderBy: {
                    title: 'desc'
                }
            });
        }

        return prisma.post.findMany({
            where: {
                published: {
                    equals: true,
                },
                OR: [
                    {
                        title: {
                            contains: args.query.toLowerCase(),
                        },
                    },
                    {
                        body: {
                            contains: args.query.toLowerCase(),
                        },
                    },
                ],
            }
        })
    },
    comments(parent, args, { db, prisma, user }, info) {
        isAuthorized(user)
        return prisma.comment.findMany()
    },
    async post(parent, args, { db, prisma, user }, info) {
        const userId = user?.userId || null;
        const postId = parseInt(args.id)

        console.log(userId, postId);

        return prisma.post.findFirst({
            where: {
                id: postId,
                OR: [
                    {
                        published: true
                    }, {
                        author: userId
                    }
                ],
            }
        })
    },
}

export { Query as default }