package dope.digger

import akka.http.scaladsl.model.DateTime
import dope.digger.user.User

import scala.language.implicitConversions

package object chat {
  implicit def chatEventToChatMessage(event: IncomingMessage): ChatMessage = ChatMessage(event.sender, event.message)

  case class Room(id: Int, topic: String)
  case class CreateRoom(topic: String)
  case class UpdateRoom(id: Int, topic: String)

  case class DopeMessage(content: String, author: User, date: DateTime = DateTime.now)
  case class ChatActivityMessage(action: String, user: User)

  case class RoomStatus(id: Int, topic: String, onlineUsers: List[User] = List.empty[User])
}
