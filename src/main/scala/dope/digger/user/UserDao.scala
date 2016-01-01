package dope.digger.user

/**
 * Created by inakov on 01.01.16.
 */
object UserDao {

  var users: Map[String, User] = predefUsers

  def find(userId: String): User = users(userId)

  def create(userId: String, name: String, profilePicture: String): User = {
    val newUser = User(userId, name, profilePicture)
    users += userId -> newUser

    newUser
  }

  private def predefUsers = Map(
    "1" -> User("1", "Ivan Nakov", "http://www.palauoek.com/wp-content/uploads/2014/07/profile-default-male.png"),
    "2" -> User("2", "Slav Georgiev", "http://www.palauoek.com/wp-content/uploads/2014/07/profile-default-male.png"),
    "3" -> User("3", "Kameliya Kisyova", "http://st1.bollywoodlife.com/wp-content/uploads/2014/09/female-default-pic-big.jpg"),
    "4" -> User("4", "Elena Gancheva", "http://st1.bollywoodlife.com/wp-content/uploads/2014/09/female-default-pic-big.jpg")
  )

}
