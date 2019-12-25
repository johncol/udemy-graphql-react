const graphQL = require('graphql');
const api = require('./../api');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } = graphQL;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    website: { type: GraphQLString },
    company: {
      type: CompanyType,
      resolve: (parentValue, _args) => api.fetchCompany(parentValue.companyId)
    }
  })
});

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    catchPhrase: { type: GraphQLString },
    bs: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve: (parentValue, _args) => api.fetchCompanyUsers(parentValue.id)
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_parentValue, args) => api.fetchUser(args.id)
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_parentValue, args) => api.fetchCompany(args.id)
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
