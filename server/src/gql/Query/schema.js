module.exports = `
  type Query {
    getPlace(place: String!, radius: Int!, lat: Float, lng: Float, ): [Place]
    login(email: String!, password: String!): User!
    fbLogin(accessToken: String!): User!
  }
`
