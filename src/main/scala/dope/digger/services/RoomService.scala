package dope.digger.services

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.server.Directives._
import akka.stream.Materializer
import dope.digger.chat.{CreateRoom, RoomDao}
import spray.json._
import dope.digger.DopeJsonProtocol._


/**
 * Created by inakov on 02.01.16.
 */
object RoomService {
  def route(implicit materializer: Materializer) =
    path("rooms") {
      get {
        complete {
          RoomDao.getRooms
        }
      }
    } ~
    path("room") {
      post {
        entity(as[CreateRoom]) {
          room => complete {
            RoomDao.createRoom(room.topic)
          }
        }
      }
    }
}
