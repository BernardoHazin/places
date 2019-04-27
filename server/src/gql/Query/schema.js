module.exports = `
  type Query {
    getPlace(place: String!, lat: Float, lng: Float, ): [Place]
  }
`
