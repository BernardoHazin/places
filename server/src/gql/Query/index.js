const { GOOGLE_API_KEY } = require('../../config/')
const fetch = require('node-fetch')
const { authentication } = require('../../config/')
const { sign } = require('jsonwebtoken')
const gravatar = require('gravatar')
const FB = require('../../fb')

function signJWT(user) {
  return sign({ user }, authentication.secret, {
    expiresIn: authentication.expiration
  })
}

module.exports = {
  getPlace: async (parent, { place, lat, lng, radius }, { models }) => {
    let url = new URL(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    )
    url.searchParams.append('location', `${lat},${lng}`)
    url.searchParams.append('key', GOOGLE_API_KEY)
    url.searchParams.append('radius', radius * 1000)
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
  },
  login: async (parent, { email, password }, { models }) => {
    const user = await models.User.findOne({ where: { email } })
    if (!user) return new Error('Email ou senha incorretos')
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) new Error('Email ou senha incorretos')
    return {
      email: user.email,
      token: signJWT(user.email),
      profileImg: user.profileImg
    }
  },
  fbLogin: async (parent, { accessToken }, { models }) => {
    const { email, name } = await new Promise((resolve, reject) => {
      FB.api('/me', { fields: 'email,name', access_token: accessToken }, res =>
        resolve(res)
      )
    })
    if (email && name) {
      return models.User.findOrCreate({
        where: {
          email,
          name
        },
        attributes: {
          exclude: ['password']
        },
        defaults: {
          password: '-',
          profileImg: gravatar.url(
            email,
            { s: '200', r: 'x', d: 'retro' },
            true
          )
        }
      }).then(([{ dataValues }]) => ({
        ...dataValues,
        token: signJWT(dataValues.email)
      }))
    } else return new Error('Não foi possível realizar a autenticação')
  }
}
