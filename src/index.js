const { v4: uuidv4 } = require('uuid')
const { request, response } = require('express');
const express = require('express')

const app = express();

app.use(express.json());

const costumers = [];

// Middleware

function verifyIfExistAccountCPF (request, response, next) {
  const { cpf } = request.headers;

  const costumer = costumers.find((costumer) => costumer.cpf === cpf);

  if(!costumer) {
    return response.status(400).json({error: "Costumer not found"})
  }

  request.costumer = costumer;

  return next();
}


app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const costumerAlreadyExists = costumers.some(
    (costumer) => costumer.cpf === cpf
  );

  if(costumerAlreadyExists) {
    return response.status(401).json({ error: "User already exists" })
  }
  
  costumers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [

    ]
  });

  return response.status(201).send('Usuário criado')
});

app.get("/statements", verifyIfExistAccountCPF, (request, response) => {

  const { costumer } = request;

  return response.json(costumer.statement);
})


app.post("/deposit",verifyIfExistAccountCPF, (request, response) => {
  const { description, amout } = request.body;

  const { costumer } = request;

  const statementOperation = {
    description,
    amout,
    created_at:  new Date(),
    type: "credit"
  }

  costumer.statement.push(statementOperation)

  return response.status(201).send();
})

app.listen(3333);