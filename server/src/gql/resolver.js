const fetch = require('node-fetch')
const gravatar = require('gravatar')
const { GOOGLE_API_KEY, authentication } = require('../config')
const { sign } = require('jsonwebtoken')
const FB = require('../fb')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()
const emailRegex = new RegExp(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
)

function signJWT(user) {
  return sign({ user }, authentication.secret, {
    expiresIn: authentication.expiration
  })
}

module.exports = {
  Mutation: {
    registerUser: async (parent, args, { models }) => {
      if (!emailRegex.test(args.email)) return new Error('Email inválido')
      if (args.password.length < 8)
        return new Error('Senha muito curta (Min. 8 caracteres)')
      args.profileImg = gravatar.url(
        args.email,
        { s: '200', r: 'x', d: 'retro' },
        true
      )
      return models.User.create(args)
        .then(({ email, profileImg }) => ({
          email,
          profileImg,
          token: signJWT(email)
        }))
        .catch(err => {
          console.log(err.message)
          if (err.message === 'Validation error')
            return new Error('Este email já está em uso')
          else return new Error('Não foi possível efetuar o cadastro')
        })
    },
    addAvaliation: async (parent, args, { models, req }) => {
      if (!req.user) return new Error('Sessão inválida')
      const reviews = await models.Avaliation.findOrCreate({
        where: {
          userEmail: args.userEmail,
          placeId: args.placeId
        },
        defaults: args
      }).then(([avaliation, created]) => {
        if (!created) return new Error('Você já avaliou este lugar')
        return 'Avaliação criada'
      })
      const pubsubReviews = await models.Avaliation.findAndCountAll({
        where: { placeId: args.placeId },
        include: [{ model: models.User }]
      }).then(({ rows }) => {
        return rows.map(({ User, rating, comment }) => ({
          name: User.name,
          placeId: args.placeId,
          email: User.email,
          profileImg: User.profileImg,
          rating: Number(rating),
          comment
        }))
      })
      pubsub.publish('avaliationAdded', { avaliationAdded: pubsubReviews })
      return reviews
    }
  },
  Query: {
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
        name: user.name,
        token: signJWT(user.email),
        profileImg: user.profileImg
      }
    },
    fbLogin: async (parent, { accessToken }, { models }) => {
      const { email, name } = await new Promise((resolve, reject) => {
        FB.api(
          '/me',
          { fields: 'email,name', access_token: accessToken },
          res => resolve(res)
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
    },
    getAvaliations: async (parent, { placeId }, { models, req }) => {
      return models.Avaliation.findAndCountAll({
        where: { placeId },
        include: [{ model: models.User }]
      }).then(({ rows }) => {
        return rows.map(({ User, rating, comment }) => ({
          name: User.name,
          email: User.email,
          profileImg: User.profileImg,
          rating: Number(rating),
          comment
        }))
      })
    }
  },
  Subscription: {
    avaliationAdded: {
      subscribe: () => pubsub.asyncIterator('avaliationAdded')
    }
  }
}
