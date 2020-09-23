const db = require("../models");
const User = db.user;
const Token = db.token;
const Friend = db.friendship;

exports.createUser = async ({ name, password, description = 'Description was not specified' }) => {
  return await User.create({ name, password, description })
    .then((user) => {
      console.log('Created user: ' + JSON.stringify(user, null, 4));
      return user;
    })
    .catch((err) => {
      console.log('Error while creating user: ', err);
    });
};

exports.getAllUsers = async () => {
  return await User.findAll()
    .then((user) => {
      console.log('All users: ' + JSON.stringify(user, null, 4));
      return user;
    })
    .catch((err) => {
      console.log('Error while fetching users: ', err);
    });
};

exports.getUser = async obj => {
  return await User.findOne({
    where: obj,
  })
    .then((user) => {
      console.log('Found user: ' + JSON.stringify(user, null, 4));
      return user;
    })
    .catch((err) => {
      console.log('Error while fetching user: ', err);
    });
};

exports.createToken = (userId, token) => {
  return Token.upsert({
    token: token,
    userId: userId
  })
    .then((token) => {
      console.log('Token created: ' + JSON.stringify(token, null, 4));
      return token;
    })
    .catch((err) => {
      console.log('Error while creating token: ', err);
    });
};

exports.addFriend = (userId, friendId) => {
  return Friend.create({
    userId: userId,
    friendId: friendId
  })
    .then(() => {
      console.log('Friendship created with: ' + JSON.stringify(friendId, null, 4));
    })
    .catch((err) => {
      console.log('Error while creating friendship: ', err);
    });
};
