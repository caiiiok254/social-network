const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const db = require('./app/models');
const controller = require('./app/controllers/user');
const app = express();
const User = db.user;
const Token = db.token;
const Friend = db.friendship;

//JWT auth block
let ExtractJwt = passportJWT.ExtractJwt;

let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'superlongsecretkey';

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = controller.getUser({ id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

//DB connection and database migration
db.sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

User.sync()
  .then(() => console.log('User table created successfully'))
  .catch(err => console.log('Something goes wrong when creating a user table'));

Token.sync()
  .then(() => console.log('Token table created successfully'))
  .catch(err => console.log('Something goes wrong when creating a token table'));

Friend.sync()
  .then(() => console.log('Friendship table created successfully'))
  .catch(err => console.log('Something goes wrong when creating a friendship table'));

//Routes
app.get('/', function(req, res) {
  res.json({ message: 'Works fine' });
});

app.get('/api/users', passport.authenticate('jwt', { session: false }), function(req, res) {
  controller.getAllUsers().then(user => res.json(user));
});

app.post('/api/register', function(req, res, next) {
  const { name, password, description } = req.body;
  controller.createUser({ name, password, description }).then(user => res.json(user));
});

app.post('/api/login', async function(req, res, next) {
  const { name, password } = req.body;
  if ( name && password) {
    let user = await controller.getUser({ name })
      .then((user) => {
        if (user.password === password) {
          let payload = { id: user.id };
          let token = jwt.sign(payload, jwtOptions.secretOrKey);
          controller.createToken(user.id, token);
          res.json({ msg: 'Auth successful', token: token });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        res.status(401).json({ msg: 'Credentials is incorrect' });
      })
  } else {
    res.status(400).json({ msg: 'Wrong request'});
  }
});

app.post('/api/addFriend', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
  req.user.then((user) => {
    const friendId = req.body.friendId;
    controller.addFriend(user.dataValues.id, friendId)
      .then(res.json('Friendship created'))
      .catch((err) => {
        res.status(400).json({ msg: 'Friendship was not created', err });
      })
  })
    .catch(() => {
      res.status(400).json({ msg: 'You are already friends'})
    })
})

app.get('/api/showFriends', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
  req.user.then((user) => {
    User.findOne({where: user.dataValues.id , include: 'friends'}).then((result) => {
      let friends = JSON.stringify(result.friends, null, 2);
      res.status(200).json(JSON.parse(friends));
    });
  })
})

app.listen(3000, function() {
  console.log('Express is running on port 3000');
});
