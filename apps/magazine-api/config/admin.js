module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'e8f81b6ec7804ef09b4bfaf2c2f2d39a'),
  },
});
