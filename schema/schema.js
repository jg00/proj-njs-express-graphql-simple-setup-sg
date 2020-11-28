const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
const axios = require("axios");

// Instruct graphql that our application has the concept of a user.  Two required properties - name (always be a string that describes the type we are defining), fields (diff props a user has).
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

// Specific Node - here if you are looking for a user, provided the id, graphql will return a user of type UserType.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((resp) => resp.data); // resp returned { data: { firstName: 'bill' }} but we only want the data.
      },
    },
  },
});

// GraphQLSchema takes in a root query and returns a GraphQL schema instance
module.exports = new GraphQLSchema({
  query: RootQuery,
});

/*
  Schema - inform graphQL how our data in our application is arranged

  resolve(parentValue, args) - purpose is to get the data from our data source.  resolve() can return a promise.
    If we return a promise from the resolve() function, graphQL will automatically detect that we've returned
    a promise, wait for the promise to resolve, then when it does, grab the data that it resolved with, and send
    a response back tot he user.

  parentValue - rarely used
  args - arguments passed into the original query
*/

/* Ref using static list of users
  const _ = require("lodash");

  // Static list for test
  const users = [
    { id: "23", firstName: "Bill", age: 20 },
    { id: "47", firstName: "Samantha", age: 21 },
  ];


  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      user: {
        type: UserType,
        args: { id: { type: GraphQLString } },
        resolve(parentValue, args) {
          return _.find(users, { id: args.id }); // expect to return raw JSON or raw JS object { id: '23', firstName: 'Bill', age: 20 }
          // return users.find((user) => user.id === args.id);
        },
      },
    },
  });
*/
