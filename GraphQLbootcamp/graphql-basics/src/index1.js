import { createServer } from '@graphql-yoga/node'


const typeDefs0 = `
    type Query {
        hello: String!
        name: String!
    }
`

const resolvers0 = {
    Query: {
        hello: () => 'Hello from Yoga!',
        name: () => 'jhony'
    },
}

const typeDefs1 = `
    type Query {
       id: ID!
       name: String!
       age: Int!
       employed: Boolean!
       gpa: Float!

    }
`

const resolvers1 = {
    Query: {
        id: () => '12344',
        name: () => 'jhony',
        age: () => 34,
        employed: () => true,
        gpa: () => null,
    },
}


const typeDefs = `
    type Query {
       me: User!
       post: Post!
       greeting(name: String): String!
       add(a: Float, b: Float!): Float!
       addFloat(numbers: [Float]!): Float!
       grades: [Int]!
       users: [User]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
    `

const resolvers = {
    Query: {
        users: () => {
            return [{
                id: "123",
                name: "jhony",
                email: "jhony@gmail.com",
                age: 34
            }, {
                id: "234",
                name: "pepe",
                email: "pepe@gmail.com",
                age: 19
            }]
        },
        grades: () => {
            return [1, 2, 3, 4]
        },
        greeting: (parent, args, ctx, info) => {
            if (args.name) {
                return `Hello ${args.name}`
            }
            else {
                return 'Hello'
            }

        },
        add: (parent, args, ctx, info) => {
            return args.a + args.b
        },
        addFloat: (parent, args, ctx, info) => {
            if (!args.numbers.length) {
                return 0
            }

            return args.numbers.reduce((acc, cv) => {
                return acc + cv
            })
        },
        me() {
            return {
                id: "1223",
                name: "jhony",
                email: "jhony@gmail.com",
                age: 34
            }
        },

        post() {
            return {
                id: "555",
                title: "postTitle",
                body: "body description",
                published: true
            }
        }
    },
}



const server = createServer({
    schema: {
        typeDefs,
        resolvers
    },
})

server.start()