import unittest
from database import DB

class databaseTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        # print("open")
        self.db = DB()
        self.newuser = 'testuser123'

    @classmethod
    def tearDownClass(self):
        """Call after every test case."""
        self.db.deleteUser(self.newuser)
        # print("close")
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
        assert self.db.resetPassword('testuser456', 'foo123', 'Red') == True

    def testResetPasswordFail(self):
        """User password was not updated becuase the username or security question was wrong"""
        assert self.db.resetPassword('testuser456', 'foo123', 'Red1') == False

    def testCreateUserFail(self):
        """Fail to create a new user because another user with that name already exists"""
        assert self.db.createUser('testuser', 'foo123', 'favorite color', 'Red') == False

    def testCreateUserPass(self):
        """Create the new user"""
        assert self.db.createUser(self.newuser, 'foo123', 'favorite color', 'Red') == True

if __name__ == "__main__":
    unittest.main() # run all tests  