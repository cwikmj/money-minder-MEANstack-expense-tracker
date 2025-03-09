const express = require('express')
const router = express.Router()
const fs = require('fs')
const routesPath = `${__dirname}/`
const { removeExtensionFromFile } = require('../middleware/utils')

router.use('/', require('./auth'))


fs.readdirSync(routesPath).filter((file) => {
    const routeFile = removeExtensionFromFile(file)
    return routeFile !== 'index' && routeFile !== 'auth' && file !== '.DS_Store'
        ? router.use(`/${routeFile}`, require(`./${routeFile}`))
        : ''
})

router.get('/', (req, res) => {
    res.render('index')
})

router.use((err, req, res, next) => {
    if (!err) {
        return next()
    }
    console.log(err)
    return res.status(404).json({
        error: 'Hmm.. nothing here for sure...'
    })
})

router.use('*', (req, res) => {
    res.status(404).json({
        errors: {
            msg: 'URL not found'
        }
    })
})

module.exports = router
