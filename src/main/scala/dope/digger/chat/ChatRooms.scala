package dope.digger.chat

import akka.actor.ActorSystem

import scala.concurrent.{ExecutionContext, Future}

object ChatRooms {
  var chatRooms: Map[Int, ChatRoom] = Map.empty[Int, ChatRoom]

  def findOrCreate(number: Int)(implicit actorSystem: ActorSystem): ChatRoom =
    chatRooms.getOrElse(number, createNewChatRoom(number))

  def loadRoom(roomId: Int)(implicit ec: ExecutionContext): Future[RoomStatus] ={
    val room = RoomDao.getRoom(roomId)
    chatRooms.get(roomId) match{
      case None => Future{ RoomStatus(room.id, room.topic) }
      case Some(chatRoom) => chatRoom.onlineUsers.map(users => RoomStatus(room.id, room.topic, users))
    }
  }

  private def createNewChatRoom(number: Int)(implicit actorSystem: ActorSystem): ChatRoom = {
    val chatroom = ChatRoom(number)
    chatRooms += number -> chatroom
    chatroom
  }

}
