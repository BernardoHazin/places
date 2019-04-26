const { GOOGLE_API_KEY } = require('../../config/')
const fetch = require('node-fetch')

module.exports = {
  allUsers: async (parent, args, { models }) => {
    const users = await models.User.findAll()
    return users
  },
  getPlace: async (parent, { place, lat, lng }, { models }) => {
    let url = new URL(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    )
    url.searchParams.append('location', `${lat},${lng}`)
    url.searchParams.append('key', GOOGLE_API_KEY)
    url.searchParams.append('radius', '8000')
    url.searchParams.append('name', place)
    url.searchParams.append('language', 'pt-BR')
    console.log(url.href)
    let response = await fetch(url.href)
    response = await response.json()
    return response.results.map(el => ({
      id: el.place_id,
      icon: el.icon,
      name: el.name,
      address: el.formatted_address,
      phone: el.formatted_phone_number,
      rating: el.rating,
      website: el.website,
      isOpen: el.opening_hours && el.opening_hours.open_now,
      lat: el.geometry.location.lat,
      lng: el.geometry.location.lng
    }))
  }
}
