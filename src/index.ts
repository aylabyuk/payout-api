import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { Prisma } from './generated/prisma'
import { Context } from './utils'
import { me, signup, login, AuthPayload } from './auth'

const resolvers = {
  Query: {
    me,
    person(parent, { id }, context: Context, info) {
      return context.db.query.person({ where: { id: id } }, info)
    },
    people(parent, args, context: Context, info) {
      return context.db.query.persons({}, info)
    },
    role(parent, { id }, context: Context, info) {
      return context.db.query.role({ where: { id: id } }, info)
    },
    roles(parent, args, context: Context, info) {
      return context.db.query.roles({}, info)
    }
  },
  Mutation: {
    signup,
    login,
    createRole(parent, args, context: Context, info) {
      return context.db.mutation.createRole(
        { data: args },
        info
      )
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'https://eu1.prisma.sh/public-tinydutchess-157/payout-app/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queries & mutations
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
