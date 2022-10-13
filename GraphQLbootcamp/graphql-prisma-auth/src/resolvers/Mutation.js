import { GraphQLYogaError } from '@graphql-yoga/node';

import generateToken from '../../utils/generateToken';
import hasPassword from '../../utils/hasPassword';
import isAuthorized from "../../utils/unauthorize";

const Mutation = {
    async login(parent, args, { prisma }, info) {
        const user = await prisma.user.findFirst({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken({ userId: user.id })
        }
    },
    async createUser(parent, args, { db, prisma }, info) {

        const emailTaken = await prisma.user.findFirst({
            where: { email: args.data.email }
        })

        if (emailTaken) {
            console.log("error");
            throw new Error('Email taken')
        }


        const password = await hasPassword(args.data.password)
        const user = await prisma.user.create({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken({ userId: user.id })
        }

    },
    deleteUser: async (parent, args, { db, prisma, user: userAuth }, info) => {

        //try {
        const id = isAuthorized(userAuth);
        const user = await prisma.user.findFirst({
            where: {
                id: id,
            }
        })

        if (!user) {
            throw new GraphQLYogaError('User not found')
        }

        const deleteUser = await prisma.user.delete({
            where: { id: id }
        })

        return deleteUser
        // } catch (error) {
        //     console.error(error);
        //     throw new GraphQLYogaError("delete internal error, ")
        // }



        // const userIndex = db.users.findIndex((user) => user.id === args.id)

        // if (userIndex === -1) {
        //     throw new Error('User not found')
        // }

        // const deletedUsers = db.users.splice(userIndex, 1)

        // db.posts = db.posts.filter((post) => {
        //     const match = post.author === args.id

        //     if (match) {
        //         db.comments = db.comments.filter((comment) => comment.post !== post.id)
        //     }

        //     return !match
        // })
        // db.comments = db.comments.filter((comment) => comment.author !== args.id)

        // return deletedUsers[0]
    },
    async updateUser(parent, args, { db, prisma }, info) {
        const { id, data } = args

        const user = await prisma.user.findFirst({
            where: {
                id: parseInt(id),
            }
        })

        if (!user) {
            throw new GraphQLYogaError('User not found')
        }

        const updateUser = await prisma.user.update({
            where: {
                id: parseInt(id),
            },
            data: {
                ...data
            },
        })

        return updateUser

    },
    async createPost(parent, args, { db, prisma, pubSub }, info) {


        const post = await prisma.post.create({
            data: { ...args.data, author: parseInt(args.data.author) },
        })

        if (args.data.published) {
            pubSub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post

    },
    async deletePost(parent, args, { db, prisma, pubSub }, info) {

        const id = parseInt(args.id)
        const postExists = await prisma.post.findFirst({
            where: {
                id: id,
            }
        })

        if (!postExists) {
            throw new GraphQLYogaError('Post not found')
        }

        const post = await prisma.post.delete({
            where: { id: id }
        })

        if (post.published) {
            pubSub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post

    },
    async updatePost(parent, args, { db, prisma, pubSub }, info) {

        const id = parseInt(args.id)
        const { data } = args

        const postExists = await prisma.post.findFirst({
            where: {
                id: id,
            }
        })

        if (!postExists) {
            throw new GraphQLYogaError('Post not found')
        }

        const post = await prisma.post.update({
            where: {
                id: id,
            },
            data: {
                ...data
            },
        })

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (postExists.published && !post.published) {
                pubSub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: postExists
                    }
                })
            } else if (!postExists.published && post.published) {
                pubSub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubSub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post

    },
    async createComment(parent, args, { db, prisma, pubSub }, info) {

        const authorId = parseInt(args.data.author)
        const postId = parseInt(args.data.post)

        const { text } = args.data

        const postExists = await prisma.post.findFirst({
            where: {
                id: postId,
            }
        })

        const userExists = await prisma.user.findFirst({
            where: {
                id: authorId,
            }
        })

        if (!userExists || !postExists) {
            throw new Error('Unable to find user or post')
        }

        const comment = await prisma.comment.create({
            data: { text, post: postId, author: authorId },
        })

        pubSub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
    },
    async deleteComment(parent, args, { db, prisma, pubSub }, info) {
        const id = parseInt(args.id)

        const commentExists = await prisma.comment.findFirst({
            where: {
                id: id,
            }
        })


        if (!commentExists) {
            throw new Error('Comment not found')
        }

        const deletedComment = await prisma.comment.delete({
            where: { id: id }
        })


        pubSub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
    },
    async updateComment(parent, args, { db, prisma, pubSub }, info) {
        const id = parseInt(args.id)
        const { data } = args

        const commentExists = await prisma.comment.findFirst({
            where: {
                id: id,
            }
        })

        if (!commentExists) {
            throw new Error('Comment not found')
        }

        const comment = await prisma.comment.update({
            where: {
                id: id,
            },
            data: {
                ...data
            },
        })

        pubSub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }