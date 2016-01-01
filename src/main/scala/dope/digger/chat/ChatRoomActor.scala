package dope.digger.chat

import akka.actor.{Actor, ActorRef}
import dope.digger.user.UserDao
import spray.json._
import dope.digger.DopeJsonProtocol._

class ChatRoomActor(roomId: Int) extends Actor {

  var participants: Map[String, ActorRef] = Map.empty[String, ActorRef]

  override def receive: Receive = {
    case UserJoined(name, actorRef) =>
      participants += name -> actorRef
      broadcast(SystemMessage(ChatActivityMessage("JOINED", UserDao.find(name)).toJson.toString))
      println(s"User $name joined channel[$roomId]")

    case UserLeft(name) =>
      println(s"User $name left channel[$roomId]")
      broadcast(SystemMessage(ChatActivityMessage("LEFT", UserDao.find(name)).toJson.toString))
      participants -= name

    case msg: IncomingMessage =>
      val content = DopeMessage(msg.message, UserDao.find(msg.sender)).toJson.toString
      broadcast(ChatMessage(msg.sender, text = content))

  }

  def broadcast(message: ChatMessage): Unit = participants.values.foreach(_ ! message)

}
