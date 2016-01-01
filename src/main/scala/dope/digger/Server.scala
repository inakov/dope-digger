package dope.digger

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import dope.digger.services.{MainService, ChatService, EchoService}

import scala.io.StdIn

object Server extends App {

  import Directives._

  implicit val actorSystem = ActorSystem("akka-system")
  implicit val flowMaterializer = ActorMaterializer()

  val config = actorSystem.settings.config

  val interface = config.getString("app.interface")
  val port = config.getInt("app.port")

  val route = MainService.route ~ EchoService.route ~ ChatService.route

  val binding = Http().bindAndHandle(route, interface, port)
  println(s"Server is now online at http://$interface:$port\nPress RETURN to stop...")

  StdIn.readLine()

  import actorSystem.dispatcher
  binding.flatMap(_.unbind()).onComplete(_ => actorSystem.shutdown())
  println("Server is down...")
}
