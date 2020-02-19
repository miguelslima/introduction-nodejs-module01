const express  = require('express');

const server = express();

server.use(express.json());
//Query params = ?users=Miguel
//Route params = /users/1
//Request body = { "name": "Miguel", "email": "miguelsousalima@hotmail.com" }

//CRUD - Create, Read, Update, Delete

const users = ['Miguel', 'Magda', 'Yuri', 'Bernardo'];

//Middleware
server.use((req, res, next) => {
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  
  return next();
})

function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User name is required'});
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
 
  if(!user) {
    return res.status(400).json({error: 'Users does not exists'});
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
})

//Query Params
server.get('/users', (req, res) =>{

  return res.json(req.user)
});

//Route Params
server.get('/users/:index', checkUserInArray, (req, res) =>{
  const { index } = req.params;

  return res.json(users[index]);
});

server.post('/users', checkUsersExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUsersExists, checkUserInArray, (req, res) => {
  const {index} = req.params;
  const {name} = req.body;

  users[index] = name;

  return res.json(users);

})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json({message: "Usuario deletado com sucesso!"});
})

server.listen(3000);