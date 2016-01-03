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
      val event = "{\"type\":'system', \"data\":" + ChatActivityMessage("JOINED", UserDao.find(name)).toJson.toString+"}"
      broadcast(SystemMessage(event))
      println(s"User $name joined channel[$roomId]")

    case UserLeft(name) =>
      println(s"User $name left channel[$roomId]")
      val event = "{\"type\":'system', \"data\":" + ChatActivityMessage("LEFT", UserDao.find(name)).toJson.toString+"}"
      broadcast(SystemMessage(event))
      participants -= name

    case msg: IncomingMessage =>
      val content = DopeMessage(msg.message, UserDao.find(msg.sender)).toJson.toString
      val event = "{\"type\":'message', \"data\":"+ content +"}"
      broadcast(ChatMessage(msg.sender, text = event))

  }

  def broadcast(message: ChatMessage): Unit = participants.values.foreach(_ ! message)

}
