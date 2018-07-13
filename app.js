const express = require('express');
      jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

//this is protected with jwt
app.post('/api/posts', verifyToken, async (req, res) => {

  try {
    const authData = jwt.verify(req.token, 'secretKey');
    res.json({
      message: 'POST created',
      authData: authData
    })
  } catch(e) {
    console.log("JWT verification failed");
    res.sendStatus(403);
  }


  res.json({
    message: 'post created'
  })
});

//set jwt here
app.post('/api/login', async (req, res) => {
  //mock user
  const user = {
    id: 1,
    username: 'brad',
    email: 'brad@gmail.com'
  }

  try {
    const token = await jwt.sign({ user: user }, 'secretKey');
    if(token){
      res.json({
        token: token
      });
    }
  } catch (e) {
    console.log("JWT initialization error: ", e);
  }
});

/*
FORMAT OF TOKEN
  AuthorizationL Bearer <access_token>
*/
//verify token func
function verifyToken(req, res, next) {
  //get auth header value
  const bearerHeader = req.headers['authorization'];
  //check if berer is undefined
  if(typeof bearerHeader !== 'undefined'){
      //split at the space
      const bearer = bearerHeader.split(' ');
      //get token
      const bearerToken = bearer[1];
      //set token
      req.token = bearerToken;
      //next
      next();
  } else  {
    res.sendStatus(403);
  }
}


app.listen(PORT, () => console.log(`SERVER started at port: ${PORT}`));
