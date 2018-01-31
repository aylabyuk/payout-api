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
      return context.db.query.persons(args, info)
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
    createPerson(parent, args, context: Context, info) {
      return context.db.mutation.createPerson({
         data: {
          firstName: args.firstName,
          lastName: args.lastName,
          gender: args.gender,
          birthDate: args.birthdate,
          address: args.address,
          role: { connect: { id: args.roleId }}
         }
      },
        info
      )
    },
    updatePerson(parent, args, context: Context, info) {

      return context.db.mutation.updatePerson({
        data: {
          firstName: args.firstName,
          lastName: args.lastName,
          gender: args.gender,
          birthDate: args.birthdate,
          address: args.address,
          role: { connect: { id: args.roleId } }
        },
        where: {
          id: args.id,
        }
      })
    },
    deletePerson(parent, { id }, context: Context, info) {
      return context.db.mutation.deletePerson({
        where: {
          id
        }
      })
    },
    createRole(parent, args, context: Context, info) {
      return context.db.mutation.createRole(
        { data: args },
        info
      )
    },
    updateRole(parent, args, context: Context, info) {
      return context.db.mutation.updateRole({
        data: {
          name: args.name,
          description: args.description,
          ratePerHour: args.ratePerHour
        },
        where: {
          id: args.id,
        }
      })
    },
    deleteRole(parent, { id }, context: Context, info) {
      return context.db.mutation.deleteRole({
        where: {
          id
        }
      })
    }
  },
  Subscription: {
    rolesChanges: {
      subscribe: async (parent, args, ctx, info) => {
        return ctx.db.subscription.role(
          { },
          info
        )
      }
    },
    peopleChanges: {
      subscribe: async (parent, args, ctx, info) => {
        return ctx.db.subscription.person(
          { },
          info
        )
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'http://localhost:4466/payout-app/dev',
      // endpoint: 'https://eu1.prisma.sh/public-tinydutchess-157/payout-app/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queries & mutations
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
