const routes = require("next-routes")();

routes
    .add('/about', '/about')
    .add('/checkAddress', '/check')
    .add('/testing', '/testing')

module.exports = routes;