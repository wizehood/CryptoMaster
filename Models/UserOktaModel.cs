namespace CryptoMaster.Models
{
    public class UserOktaModel
    {
        public Profile Profile { get; set; }

        public Credentials Credentials { get; set; }
    }

    public class Profile
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Login { get; set; }
    }

    public class Credentials
    {
        public Password Password { get; set; }
    }

    public class Password
    {
        public string Value { get; set; }
    }
}
