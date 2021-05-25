const debug = require('debug')

const log = debug('app:index')

const applicationEnvVars = ['NODE_ENV', 'PORT', 'RESPONSE_LOGS']

const corsEnvVars = ['CORS_ORIGIN', 'CORS_METHODS']

const provenDbEnvVars = ['PROVENDB_USERNAME', 'PROVENDB_PASSWORD', 'COLLECTION_NAME', 'DB_NAME']

const encryptionEnvVars = ['ENABALE_ENCRYPTION', 'ENCRYPTION_KEY', 'ENCRYPTION_IV']

const envVars = [...applicationEnvVars, ...corsEnvVars, ...provenDbEnvVars, ...encryptionEnvVars]

/*
 * Code to check if required enviroment variables are set to run the application
 */
const unusedEnvVars = envVars.filter(i => !process.env[i])

if (unusedEnvVars.length) throw new Error('Required ENV variables are not set: [' + unusedEnvVars.join(', ') + ']')

const { app } = process.env.NODE_ENV === 'dev' ? require('./src') : require('./build/src')

app.listen(process.env.PORT, () => log(`App started on port ${process.env.PORT}`))

module.exports = app
