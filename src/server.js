/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
/* eslint-disable eol-last */
/* eslint-disable padded-blocks */
const Hapi = require('@hapi/hapi'); //import frmwork Hapi
const routes = require('./routes'); //import route

const init = async () => {

  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], //cors seluruh route
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();