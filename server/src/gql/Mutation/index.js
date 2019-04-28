const pubsub = require('../PubSub')
const gravatar = require('gravatar')
const { verify } = require('jsonwebtoken')

const emailRegex = new RegExp(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
)
module.exports = {
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
      .then(({ email, profileImg }) => ({ email, profileImg }))
      .catch(err => {
        if (err.message === 'Validation error')
          return new Error('Este email já está em uso')
        else return new Error('Não foi possível efetuar o cadastro')
      })
  },

  addAvaliation: async (parent, args, { models, req }) => {
    console.log
    return 'Hey'
  }
}
