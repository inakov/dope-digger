package dope.digger.services

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route

object MainService {

  def route: Route = pathEndOrSingleSlash {
    getFromResource("dope-digger-ui/index.html")
  } ~
  getFromResourceDirectory("dope-digger-ui")

}
