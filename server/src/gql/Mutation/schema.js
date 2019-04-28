module.exports = `
  type Mutation {
    registerUser(email: String!, password: String!): User!
    addAvaliation(placeId: String!, userEmail: String!, rating: Int!, comment: String): String!
  }
`
