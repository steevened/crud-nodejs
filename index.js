const http = require('http')
const fs = require('fs/promises')
const path = require('path')

//create a server for attend the request
//lets create, get, delete and update some users and save them into a  json

//listen the /users path, if isn't just respond with not avalable

const server = http.createServer(async (request, response) => {
  const method = request.method
  const url = request.url

  const jsonPath = path.resolve('./files/users.json')

  if (url === '/users') {
    //get users from users.json
    if (method === 'GET') {
      //read the file
      const jsonFile = await fs.readFile(jsonPath, 'UTF-8')
      //respond with the info
      response.setHeader('Content-type', 'application/json')
      response.write(jsonFile)
    }
    //post users
    if (method === 'POST') {
      //1. read the body if the request: event emiters
      const jsonFile = await fs.readFile(jsonPath, 'UTF-8')
      const usersArray = JSON.parse(jsonFile)
      request.on('data', (data) => {
        //must to convert json to object or array (parse)
        const user = JSON.parse(data)
        usersArray.push(user)
        const newJson = JSON.stringify(usersArray)
        fs.writeFile(jsonPath, newJson)
        //read the file users.json
      })
    }
    if (method === 'PUT') {
      const jsonFile = await fs.readFile(jsonPath, 'UTF-8')
      const usersArray = JSON.parse(jsonFile)
      request.on('data', (data) => {
        const user = JSON.parse(data)
        const newArr = usersArray.map((userArray) => {
          if (userArray.id === user.id) {
            userArray = user
          }
          return userArray
        })
        console.log(newArr)
        const newJson = JSON.stringify(newArr)
        fs.writeFile(jsonPath, newJson)
      })
    }
    if (method === 'DELETE') {
      const jsonFile = await fs.readFile(jsonPath, 'UTF-8')
      const usersArray = JSON.parse(jsonFile)
      request.on('data', (data) => {
        const userToDelete = JSON.parse(data)
        const jsonDeleted = usersArray.filter((user) => {
          return user.id !== userToDelete.id
        })
        const newJson = JSON.stringify(jsonDeleted)
        fs.writeFile(jsonPath, newJson)
      })
    }
  } else {
    response.write('resource not available')
  }

  response.end()
})

const PORT = 3000

server.listen(PORT)

//how to create a server with express?
