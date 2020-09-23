# social-network
Social network API test task

## Database configuration:
Mysql <br>
`app/config/env.js`

## Project init
`npm install` <br>
`nodemon index.js`

## API routes
> Accepts form-urlencode <br>

`POST http://localhost:3000/api/register`
Body: name(string), password(string), description(string)
<br><br>
`POST http://localhost:3000/api/login`
Body: name(string), password(string)
> Don't forget to grab a Bearer token from response!

<br><br>
`GET http://localhost:3000/api/users`
Auth: Bearer token
<br><br>
`POST http://localhost:3000/api/addFriend`
Body: friendId(int)
<br><br>
`GET http://localhost:3000/api/showFriends`
Auth: Bearer token
