var router = require('../NodeRails/router')

router.registerRoutes(
  router.get('/', 'login#index'),
  router.get('/welcome', 'welcome#index')
);
