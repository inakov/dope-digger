package dope.digger.chat

import akka.actor.ActorSystem

object ChatRooms {
  var chatRooms: Map[Int, ChatRoom] = Map.empty[Int, ChatRoom]

  def findOrCreate(number: Int)(implicit actorSystem: ActorSystem): ChatRoom =
    chatRooms.getOrElse(number, createNewChatRoom(number, s"It's all about $number"))

  private def createNewChatRoom(number: Int, topic: String)(implicit actorSystem: ActorSystem): ChatRoom = {
    val chatroom = ChatRoom(number, topic)
    chatRooms += number -> chatroom
    chatroom
  }

}
