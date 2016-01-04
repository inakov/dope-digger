package dope.digger.chat

/**
 * Created by inakov on 02.01.16.
 */
object RoomDao {
  private var rooms: Map[Int, Room] = predefRooms

  def getRooms: List[Room] = {
    rooms.values.toList
  }

  def getRoom(roomId: Int): Room = {
    rooms.get(roomId).get
  }

  def createRoom(topic: String): Room = {
    val room = Room(rooms.size+1, topic)
    rooms += room.id -> room

    room
  }

  def updateRoom(roomId: Int, topic: String): Room ={
    val updatedRoom = Room(roomId, topic)
    rooms += roomId -> updatedRoom
    updatedRoom
  }

  private def predefRooms = Map(
    1 -> Room(1, "Sex and Romances ;*"),
    2 -> Room(2, "Illegal substances"),
    3 -> Room(3, "Cat videos =^.^="),
    4 -> Room(4, "Free Time")
  )
}
