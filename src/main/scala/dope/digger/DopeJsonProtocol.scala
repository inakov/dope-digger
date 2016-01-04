package dope.digger

import akka.http.scaladsl.model.DateTime
import dope.digger.chat._
import dope.digger.user.User
import spray.json._

/**
 * Created by inakov on 01.01.16.
 */
object DopeJsonProtocol extends DefaultJsonProtocol {

  implicit val userFormat = jsonFormat3(User)
  implicit val roomFormat = jsonFormat2(Room)
  implicit val createRoomFormat = jsonFormat1(CreateRoom)
  implicit val updateRoomFormat = jsonFormat2(UpdateRoom)
  implicit val roomStatusFormat = jsonFormat3(RoomStatus)

  implicit object DateJsonFormat extends RootJsonFormat[DateTime] {

    override def write(obj: DateTime) = JsString(obj.toIsoDateTimeString)

    override def read(json: JsValue) : DateTime = json match {
      case JsString(s) => DateTime.fromIsoDateTimeString(s).get
      case _ => throw new DeserializationException("Error info you want here ...")
    }
  }

  implicit val dopeMessageFormat = jsonFormat3(DopeMessage)
  implicit val chatActivityMessageFormat = jsonFormat2(ChatActivityMessage)



}
