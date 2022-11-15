import unittest
import Database

class databaseTestCase(unittest.TestCase):


    def setUp(self):
        """Call before every test case"""
        self.db = Database
        self.newuser = 'testuser123'
        self.db.initCon()

    def tearDown(self):
        """Call after every test case."""
        self.db.deleteUser(self.newuser)
        self.db.closeCon()   

    def testAuthenticatePass(self):
        """Verify that True is returned when the correct userId, password combo is provided"""
        assert self.db.authenticate('testuser', 'foo') == True


    def testAuthenticateFail(self):
        """Verify that False is returned when the incorrect userId, password combo is provided"""
        assert self.db.authenticate('testuser', 'fooXYZ') == False


    def testForgotPassword(self):
        """Return the security question for the provided userID"""
        assert self.db.forgotPassword('testuser') == 'favorite color'

    def testForgotPassword2(self):
        """Return the security question for the provided userID"""
        assert self.db.forgotPassword('testuserXYZ') == 'No user with that username was found.'

    def testRestPasswordPass(self):
        """Update the password for the user with the matching username and security question hash"""
        assert self.db.resetPassword('testuser456', 'foo123', 'Red') == 'The password was successfully reset'

    def testResetPasswordFail(self):
        """User password was not updated becuase the username or security question was wrong"""
        assert self.db.resetPassword('testuser456', 'foo123', 'Red1') == 'The username or security answer provided did not match. Password was not reset.'

    def testCreateUserFail(self):
        """Fail to create a new user because another user with that name already exists"""
        assert self.db.createUser('testuser', 'foo123', 'favorite color', 'Red') == 'A user with that name already exists. Choose another user name'

    def testCreateUserPass(self):
        """Create the new user"""
        assert self.db.createUser(self.newuser, 'foo123', 'favorite color', 'Red') == 'User ' + self.newuser + ' was created!'

if __name__ == "__main__":
    unittest.main() # run all tests  