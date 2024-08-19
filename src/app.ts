import { connectDB } from "./config/mongoDB.config";
import RabbitMQClient from "./rabbitMQ/client"



class App{
  constructor(){
      connectDB()
      RabbitMQClient.initialize()
  }
}

export default App