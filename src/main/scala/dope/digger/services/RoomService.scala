package dope.digger.services

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.server.Directives._
import akka.stream.Materializer
import dope.digger.chat.{ChatRooms, UpdateRoom, CreateRoom, RoomDao}
import spray.json._
import dope.digger.DopeJsonProtocol._

import scala.concurrent.ExecutionContext


/**
 * Created by inakov on 02.01.16.
 */
object RoomService {
  def route(implicit materializer: Materializer, ec: ExecutionContext) =
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
    } ~
    path("room") {
      put {
        entity(as[UpdateRoom]) {
          room => complete {
            RoomDao.updateRoom(room.id, room.topic)
          }
        }
      }
    } ~
    pathPrefix("room" / IntNumber) { roomId =>
      get {
        complete {
          ChatRooms.loadRoom(roomId)
        }
      }
    }
}
