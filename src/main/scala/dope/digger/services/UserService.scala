package dope.digger.services

import dope.digger.user.{User, UserDao}

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.server.Directives._
import akka.stream.Materializer
import spray.json._
import dope.digger.DopeJsonProtocol._


/**
 * Created by inakov on 02.01.16.
 */
object UserService {
  def route(implicit materializer: Materializer) =
    path("user") {
      post {
        entity(as[User]) {
          user => complete {
            UserDao.create(user.id, user.name, user.profilePicture)
          }
        }
      }
    }
}
