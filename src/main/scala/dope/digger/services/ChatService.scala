package dope.digger.services

import akka.actor.ActorSystem
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.Materializer
import dope.digger.chat.ChatRooms

object ChatService {

  def route(implicit actorSystem: ActorSystem, materializer: Materializer): Route = pathPrefix("ws-chat" / IntNumber) { chatId =>
    parameter('name) { userName =>
      handleWebsocketMessages(ChatRooms.findOrCreate(chatId).websocketFlow(userName))
    }
  }
}
