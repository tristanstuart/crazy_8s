import snowflake.connector
import json


class DB():
    def __init__(self) -> None:
        
        self.initCon()

    def initCon(self):
        with open('backend/logic/creds.json') as f:
            data = json.load(f)
            username = data['username']
            password = data['password']
            SF_ACCOUNT = data["account"]
            SF_WH = data["warehouse"]

        self.con = snowflake.connector.connect(
                    user=username,
                    password=password,
                    account=SF_ACCOUNT,
                    warehouse=SF_WH,
                    database='MY_TEST_DB',
                    schema='FERENGI'
                    )

    def closeCon(self):
        self.con.close()



    def authenticate(self, uid, pwd):
        self.checkCon()
        cur = self.con.cursor()
        try:
            ret = cur.execute("select * from login where username='" + uid + "' and password = hash('" + pwd + "')").fetchone()
            if ret == None:
                return False
            else:
                return True
        finally:
            cur.close

    def createUser(self, uid, pwd, question, answer):
        self.checkCon()
        cur = self.con.cursor()
        try:
            ret = cur.execute("select * from login where username='" + uid + "'").fetchone()
            if ret == None:
                qry = "insert into login select '" + uid + "', hash('" + pwd + "'), '" + question + "', hash('" + answer + "')"
                # print(qry)
                cur.execute(qry)
                return True
                #return 'User ' + uid + ' was created!'
            else:
                return False
                #return 'A user with that name already exists. Choose another user name'            
        finally:
            cur.close()


    def forgotPassword(self, uid):
        self.checkCon()
        cur = self.con.cursor()
        try:
            qry = "select question from login where username='" + uid + "'"
            # print(qry)
            ret = cur.execute(qry).fetchone()
            if ret == None:
                return 'No user with that username was found.'
            else:
                return ret[0]            
        finally:
            cur.close()       


    def resetPassword(self, uid, newpwd, answer):
        self.checkCon()
        cur = self.con.cursor()
        try:
            qry = "update login set password = a.pwd from (select hash('" + newpwd + "') pwd from login) a where username = '" + uid + "' and answer = hash('" + answer + "')"
            # print(qry)
            col1, col2 = cur.execute(qry).fetchone()
            if col1 > 0:
                #return "The password was successfully reset"
                return True
            else:
                #return "The username or security answer provided did not match. Password was not reset."
                return False            
        finally:
            cur.close()

    def deleteUser(self, uid):
        self.checkCon()
        cur = self.con.cursor()
        try:
            qry = "delete from login where username='" + uid +"'"
            # print(qry)
            cur.execute(qry)   
        finally:
            cur.close()


    def checkCon(self):
        if self.con.is_closed:
            self.initCon()
