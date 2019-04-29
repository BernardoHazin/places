const { createServer } = require('http')
const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config/')
const models = require('./models')
const { graphiqlExpress, graphqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { typeDefs, resolvers } = require('./gql')
const consola = require('consola')
const chalk = require('chalk')
const passport = require('./passport')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use(bodyParser.json())
app.use(cors())

const server = createServer(app)

app.use((req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) req.session = err
    else req.user = user
    next()
  })(req, res, next)
})

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use(
  '/graphql',
  graphqlExpress(req => ({ schema, context: { models, req } }))
)

models.sequelize.sync({ force: false }).then(() => {
  server.listen(config.port, () => {
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema
      },
      {
        server,
        path: '/subscriptions'
      }
    )
    consola.success(`Server started at ${config.port}`)
  })
})
