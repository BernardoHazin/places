module.exports = `
  type Query {
    allUsers: [User]
    getPlace(place: String!, lat: Float, lng: Float, ): [Place]
  }
`
