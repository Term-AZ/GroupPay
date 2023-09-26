from fastapi import HTTPException, FastAPI, Response, Depends, Cookie
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID, uuid4

from app.models import User, SessionData, LoginUser, GroupId, AddUserToGroup, EditGroup, UserEmail, NewGroup, TransactionData, Transaction_Id, Update_Transacton

from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi_sessions.backends.implementations import InMemoryBackend
from fastapi_sessions.session_verifier import SessionVerifier
from fastapi_sessions.frontends.implementations import SessionCookie, CookieParameters


from datetime import date
import mysql.connector
import random
import string
import time

app = FastAPI()

time.sleep(5)

connection = mysql.connector.connect(
    host = 'GroupPayDB', port = 3306, db='gp_DB', user = 'root',password = '123')


cursor = connection.cursor()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://august.local.com:3000",
    "august.local.com:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

cookie_params = CookieParameters()

# Uses UUID
cookie = SessionCookie(
    cookie_name="cookie",
    identifier="general_verifier",
    auto_error=True,
    secret_key="DONOTUSE",
    cookie_params=cookie_params,
)
backend = InMemoryBackend[UUID, SessionData]()


class BasicVerifier(SessionVerifier[UUID, SessionData]):
    def __init__(
        self,
        *,
        identifier: str,
        auto_error: bool,
        backend: InMemoryBackend[UUID, SessionData],
        auth_http_exception: HTTPException,
    ):
        self._identifier = identifier
        self._auto_error = auto_error
        self._backend = backend
        self._auth_http_exception = auth_http_exception

    @property
    def identifier(self):
        return self._identifier

    @property
    def backend(self):
        return self._backend

    @property
    def auto_error(self):
        return self._auto_error

    @property
    def auth_http_exception(self):
        return self._auth_http_exception

    def verify_session(self, model: SessionData) -> bool:
        """If the session exists, it is valid"""
        return True


verifier = BasicVerifier(
    identifier="general_verifier",
    auto_error=True,
    backend=backend,
    auth_http_exception=HTTPException(status_code=403, detail="invalid session"),
)

print("LOADING")

@app.post("/create_session")
async def c_session(userId:str):
   content = {"message": "Id_Set"}
   response = JSONResponse(content=content)
   session = uuid4()
   data = SessionData(Id=userId)
   await backend.create(session, data)
   cookie.attach_to_response(response, session)
   print(data)
   return response

@app.post("/create_session2")
async def c_session2():
   content = {"message": "Id_Set"}
   response = JSONResponse(content=content)
   session = uuid4()
   data = SessionData(Id='49')
   await backend.create(session, data)
   cookie.attach_to_response(response, session)
   print(data)
   return response

@app.get("/verify", dependencies = [Depends(cookie)])
async def read_cookie(session_data:  SessionData=Depends(verifier)):
    print(session_data)
    return session_data


@app.post("/delete_session")
async def del_session(response: Response, session_id: UUID = Depends(cookie)):
    await backend.delete(session_id)
    cookie.delete_from_response(response)
    return "deleted session"

@app.post('/signup/')
async def addUser(user: User):
    if user.password != user.confirmPass:
        print("passsword didnt match")
        return {"response" : "Passwords do not match"}
    if "@" not in user.email:
        return {"response" : "Please enter a valid email"} 

    cursor = connection.cursor()
    statement = "SELECT COUNT(*) FROM gp_db.Users WHERE Email ='{email}'".format(email = user.email,)
    cursor.execute(statement)
    if cursor.fetchone()[0] !=0:
        print("email exists")
        return {"response" : "Email in use already"}

    statement = ("INSERT INTO Users (User_Id, User_Name, Email, User_Password, Date_Joined) VALUES (%(User_Id)s,%(User_Name)s,%(Email)s,%(User_Password)s,%(Date_Joined)s)")
    statementData = {
        "User_Id": 0,
        "User_Name": user.username,
        "Email": user.email,
        "User_Password": user.password,
        "Date_Joined": date.today()
    }
    cursor.execute(statement, statementData)
    connection.commit()
    cursor.close()
    return await c_session(Id=int(cursor.lastrowid))

@app.post('/login/')
async def loginUser(loginUser: LoginUser):
    cursor = connection.cursor()
    statement = "SELECT User_Id, User_Password FROM gp_db.Users WHERE Email='{email}'".format(email = loginUser.email)
    cursor.execute(statement)
    result = cursor.fetchall()
    cursor.close()
    print(result[0][1])
    try:
        if result[0][1] != loginUser.password:
            raise HTTPException(status_code = 403, detail="Password does not match email or the email is not registered") 
        print("passed")
        return await c_session(str(result[0][0]))
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 403, detail="Password does not match email or the email is not registered") 

@app.get('/get_groups_owned/',dependencies = [Depends(cookie)])
async def get_groups_owned(session_id:  SessionData=Depends(verifier)):
    try:
        statement = """SELECT Group_Name, gp_db.Groups.Group_Id, Date_Created, COUNT(Id) as UserCount FROM gp_db.Groups 
        INNER JOIN gp_db.Groups_Users ON gp_db.Groups_Users.Group_Id = gp_db.Groups.Group_Id 
        WHERE Group_Owner ='{user_id}' Group BY Group_Name, Group_Id, Date_Created""".format(user_id = str(session_id.Id))
        return(getResult(statement))         
    except Exception as e:
        print(e)

@app.get('/get_groups_in', dependencies = [Depends(cookie)])
async def get_groups_in(session_id: SessionData=Depends(verifier)):
    try:
        statement = """SELECT Groups.Group_Id, Group_Name, User_Name, gu.Date_Joined, UserCount 
        FROM 	
        (
            SELECT Group_Id, COUNT(Id) as UserCount
                FROM gp_db.Groups_Users 
            WHERE 
                Group_Id IN (SELECT Groups_Users.Group_Id FROM Groups_Users INNER JOIN `Groups` USING(Group_Id)  WHERE User_Id = '{u_id}' AND Group_Owner !='{u_id}')                 
            GROUP BY Group_Id
        ) GroupStats 
        INNER JOIN `Groups` USING(Group_Id) 
        INNER JOIN Users ON Users.User_Id = Group_Owner 
        INNER JOIN Groups_Users gu ON '{u_id}' = gu.User_Id  AND gu.Group_Id = Groups.Group_Id    
        """.format(u_id = session_id.Id)
        return getResult(statement)
    except Exception as e:
        print(e)

@app.get('/get_groups/',dependencies = [Depends(cookie)])
async def get_groups(session_id:  SessionData=Depends(verifier)):
    try:
        statement = "SELECT gp_db.Groups_Users.Group_Id, Group_Name FROM gp_db.Groups_Users INNER JOIN gp_db.Groups ON gp_db.Groups_Users.Group_Id=gp_db.Groups.Group_Id WHERE gp_db.Groups_Users.User_Id='{user_id}'".format(user_id = str(session_id.Id))
        #result = getResult(statement)
        return JSONResponse(content= getResult(statement))             
    except Exception as e:
        print(e)
  
@app.post('/get_users_in_group/',dependencies = [Depends(cookie)])
async def get_group_users(group:GroupId, session_id: SessionData=Depends(verifier)):
    try:
        statement = "SELECT Users.User_Name, Email, Groups_Users.Date_Joined FROM gp_db.Groups_Users INNER JOIN gp_db.Users ON gp_db.Groups_Users.User_Id = gp_db.Users.User_Id WHERE gp_db.Groups_Users.Group_Id = '{g_id}'".format(g_id = group.group_id)
        return getResult(statement)
    except Exception as e:
        print(e)


@app.post('/add_user_to_group/',dependencies = [Depends(cookie)])
async def add_user_to_group(user:AddUserToGroup, session_id: SessionData=Depends(verifier)):
    try:
        statement = "SELECT User_Id FROM gp_db.Users WHERE Email ='{userEmail}'".format(userEmail = user.email)
        result = getTableResult(statement)
        userId=result[0][0]
        print(userId)
        if(result[0][0]!= None):
            statement = "SELECT EXISTS(SELECT 1 FROM gp_db.Groups_Users WHERE User_Id='{u_id}' AND Group_Id='{g_id}')".format(u_id = userId, g_id=user.group_id)
            result = getTableResult(statement)
            if(result[0][0]==1):
                print("User already in group")
                raise HTTPException(status_code = 403, detail="User already in group")
            
            statement = "INSERT INTO gp_db.Groups_Users (Id, User_Id, Group_Id, Date_Joined) VALUES(%(Id)s,%(User_Id)s,%(Group_Id)s,%(Date_Joined)s)" 
            statementData ={
                "Id": 0,
                "User_Id": userId,
                "Group_Id": int(user.group_id),
                "Date_Joined": date.today(),
            }
            insertRow(statement, statementData)  
    except Exception as e:
        print("exception: " + str(e))
        raise HTTPException(status_code = 403, detail="User Not Found") 

@app.post('/edit_group_name/',dependencies = [Depends(cookie)])
async def edit_group_name(eGroup:EditGroup, session_id: SessionData=Depends(verifier)):
    try:
        statement = "UPDATE gp_db.Groups SET Group_Name='{g_name}' WHERE Group_Id = '{g_Id}'".format(g_name = eGroup.group_name, g_Id = eGroup.g_id)
        updateTable(statement)
    except Exception as e:
        print(e)

@app.post('/remove_user_from_group/',dependencies = [Depends(cookie)])
async def remove_user_from_group(user:AddUserToGroup, session_id: SessionData=Depends(verifier)):
    try:
        statement = "DELETE FROM gp_db.Groups_Users WHERE Group_Id = '{g_id}' AND User_Id IN(SELECT User_Id FROM gp_db.Users WHERE Email ='{u_email}')".format(g_id=user.group_id, u_email=user.email)
        updateTable(statement)
    except Exception as e:
        print(e)

@app.post('/check_if_user_exists/', dependencies = [Depends(cookie)])
async def check_if_user_exists(email:UserEmail, session_id: SessionData=Depends(verifier)):
    try:
        statement = "SELECT User_Name, Email FROM gp_db.Users WHERE Email='{u_email}'".format(u_email=email.email)
        result = getTableResult(statement)
        if(result[0][0]):
            return JSONResponse(content=result)
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 403, detail="User does not exist")

@app.post('/create_group/' , dependencies = [Depends(cookie)])
async def create_group(group:NewGroup, session_id: SessionData=Depends(verifier)):
    try:
        statement = "INSERT INTO gp_db.Groups (Group_Id, Group_Name, Group_Owner, Date_Created) VALUES(%(Group_Id)s,%(Group_Name)s,%(Group_Owner)s,%(Date_Created)s)"
        statementData ={
            "Group_Id": 0,
            "Group_Name": group.group_name,
            "Group_Owner": str(session_id.Id),
            "Date_Created": date.today(),
        }
        insertRow(statement, statementData)
        id = cursor.lastrowid

        statement = "INSERT INTO gp_db.Groups_Users (Id, User_Id, Group_Id, Date_Joined) VALUES(%(Id)s,%(User_Id)s,%(Group_Id)s,%(Date_Joined)s)"
        statementData ={
            "Id": 0,
            "User_Id": str(session_id.Id),
            "Group_Id": id ,
            "Date_Joined": date.today(),
        }
        insertRow(statement, statementData)
    except Exception as e:
        print(e)

@app.post('/create_transaction/', dependencies = [Depends(cookie)])
async def create_transaction(transaction:TransactionData,  session_id: SessionData=Depends(verifier)):
    try:
        statement = "INSERT INTO gp_db.Transactions (Transaction_Id, Transaction_Owner, Transaction_Name, Date_Created, Status, Group_Id, PayTo) VALUES(%(Transaction_Id)s,%(Transaction_Owner)s,%(Transaction_Name)s,%(Date_Created)s,%(Status)s,%(Group_Id)s, %(PayTo)s)"
        statementData ={
            "Transaction_Id": 0,
            "Transaction_Owner": (session_id.Id),
            "Transaction_Name": transaction.transactionName ,
            "Date_Created": date.today(),
            "Status": False,
            "Group_Id": transaction.group_id,
            "PayTo" : transaction.transactionEmail,
        }
        insertRow(statement, statementData)
        lastRow = cursor.lastrowid
        statement = "INSERT INTO gp_db.User_Transactions (Id, User_Id, Transaction_Id, Amount_Owned, Status, Date_Payed) VALUES (%(Id)s,%(User_Id)s,%(Transaction_Id)s,%(Amount_Owned)s,%(Status)s,%(Date_Payed)s)"
        for t in transaction.transaction:
            resultStatement = "SELECT User_ID FROM gp_db.Users WHERE Email = '{email}'".format(email = t["Email"])
            result = getTableResult(resultStatement)
            print(result[0][0])
            print(session_id.Id)
            try:
                float(t["Total"])
            except:
                t["Total"]=0.00
            statementData = {
                "Id": 0,
                "User_Id": result[0][0],
                "Transaction_Id": lastRow,
                "Amount_Owned": t["Total"],
                "Status": False if str(result[0][0]) != str(session_id.Id) else True,
                "Date_Payed": date.today() if str(result[0][0]) == str(session_id.Id) else None
            }
            insertRow(statement, statementData)
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 403, detail="Internal Error")

@app.get('/my_payments/' , dependencies = [Depends(cookie)])
async def my_payments(session_id: SessionData=Depends(verifier)):
    try:
        statement = "SELECT Transaction_Name, Transaction_Id, Group_Name, PayTo, CASE WHEN Status = 0 THEN 'Incomplete' WHEN Status >0 THEN 'Complete' END AS 'Status' FROM gp_db.Transactions INNER JOIN gp_db.Groups ON gp_db.Transactions.Group_Id = gp_db.Groups.Group_Id INNER JOIN gp_db.Users ON gp_db.Transactions.Transaction_Owner = gp_db.Users.User_Id WHERE Transaction_Owner = '{owner}' ORDER BY gp_db.Transactions.Date_Created DESC".format(owner = str(session_id.Id))
        return getResult(statement)
    except Exception as e:
        print(e)

@app.post('/get_payment', dependencies = [Depends(cookie)])
async def get_payment(transaction_id:Transaction_Id, session_id: SessionData=Depends(verifier)):
    try:
        statement = "SELECT User_Name, Amount_Owned, Status, Email FROM gp_db.User_Transactions INNER JOIN gp_db.Users ON gp_db.User_Transactions.User_Id = gp_db.Users.User_Id  WHERE gp_db.User_Transactions.Transaction_Id = '{t_id}'".format(t_id=transaction_id.transaction_id)
        return(getResult(statement))
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 403, detail="Internal Error")
    
@app.post("/delete_payment/", dependencies = [Depends(cookie)])
async def delete_payment(transaction_id: Transaction_Id, session_id: SessionData=Depends(verifier)):
    try:
        statement = "DELETE FROM gp_db.Transactions WHERE Transaction_Id='{t_id}' AND Transaction_Owner='{o_id}'".format(t_id=transaction_id.transaction_id, o_id = session_id.Id)
        updateTable(statement)
    except Exception as e:
        print(e)    

@app.get("/get_group_payments/", dependencies = [Depends(cookie)])
async def get_group_payments(session_id: SessionData=Depends(verifier)):
    try:
        statement ="""SELECT Transaction_Name, Transactions.Transaction_Id, User_Name, Amount_Owned, CASE WHEN User_Transactions.Status = 0 THEN 'Incomplete' WHEN User_Transactions.Status >0 THEN 'Complete' END AS 'Status', PayTo, Group_Name FROM gp_db.User_Transactions 
        INNER JOIN gp_db.Transactions ON Transactions.Transaction_Id = User_Transactions.Transaction_Id AND NOT Transactions.Transaction_Owner ='{u_Id}'
        INNER JOIN gp_db.Users ON Users.User_Id = Transactions.Transaction_Owner
        INNER JOIN gp_db.Groups ON Transactions.Group_Id = Groups.Group_Id
        WHERE User_Transactions.User_Id = '{u_Id}'
        """.format(u_Id = session_id.Id)
        return(getResult(statement))
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 403, detail="Internal Error")

@app.get("/get_my_recent_payments_to_make", dependencies = [Depends(cookie)])
async def get_my_recent_payments_to_make(session_id: SessionData=Depends(verifier)):
    try:
        statement = """SELECT Transactions.Transaction_Id, Transactions.Transaction_Name, Groups.Group_Name, User_Transactions.Amount_Owned FROM gp_db.User_Transactions 
         INNER JOIN gp_db.Transactions ON Transactions.Transaction_Id = User_Transactions.Transaction_Id AND NOT Transactions.Transaction_Owner ='{u_Id}'
         INNER JOIN gp_db.Groups ON Groups.Group_Id = Transactions.Group_Id
         WHERE User_Transactions.User_Id ='{u_Id}' AND User_Transactions.Status = 0
           """.format(u_Id = session_id.Id)
        return(getResult(statement))
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 403, detail="Internal Error")
    
@app.post("/leave_transactions/", dependencies = [Depends(cookie)])
async def leave_transaction(transaction_id: Transaction_Id, session_id: SessionData = Depends(verifier)):
    try:
        statement="DELETE FROM gp_db.User_Transactions WHERE Transaction_Id = '{t_id}' AND User_Id = '{u_id}'".format(t_id = transaction_id.transaction_id, u_id=session_id.Id)
        updateTable(statement)
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 403, detail="Internal Error")
    
@app.post("/update_transaction/", dependencies = [Depends(cookie)])
async def update_transaction(transaction: Update_Transacton, session_id: SessionData = Depends(verifier)):
    try:
        statement ="UPDATE gp_db.Transactions SET Transaction_Name = '{t_name}' WHERE Transaction_Id ='{t_id}' AND Transaction_Owner = '{t_owner}'".format(t_name = transaction.transaction_name, t_id=transaction.transaction_id, t_owner=session_id.Id)
        updateTable(statement)
        for k in transaction.transaction:
            statement = "UPDATE gp_db.User_Transactions SET Amount_Owned ='{t_owned}' WHERE Transaction_Id ='{t_id}' AND User_Id = (SELECT User_Id FROM gp_db.Users WHERE Email = '{e_email}')".format(t_owned=k["Amount_Owned"], t_id=transaction.transaction_id, e_email=k["Email"])
            updateTable(statement)
        statement = "SELECT User_Name, Amount_Owned, Status, Email FROM gp_db.User_Transactions INNER JOIN gp_db.Users ON gp_db.User_Transactions.User_Id = gp_db.Users.User_Id  WHERE gp_db.User_Transactions.Transaction_Id = '{t_id}'".format(t_id=transaction.transaction_id)
        return(getResult(statement))

    except Exception as e:
        print(e)

@app.get("/get_last_30_days_payments/",dependencies = [Depends(cookie)])
async def get_last_30_days_payments(session_id: SessionData = Depends(verifier)):
    try:
        statement="SELECT Transaction_Id, Transaction_Name, Group_Name, CASE WHEN Status = 0 THEN 'Incomplete' WHEN Status >0 THEN 'Complete' END AS 'Status' FROM gp_db.Transactions INNER JOIN gp_db.Groups ON gp_db.Transactions.Group_Id = gp_db.Groups.Group_Id INNER JOIN gp_db.Users ON gp_db.Transactions.Transaction_Owner = gp_db.Users.User_Id WHERE Transaction_Owner = '{owner}'  ORDER BY gp_db.Transactions.Date_Created DESC".format(owner = str(session_id.Id))
        return(getResult(statement))
    except Exception as e:
        print(e)

@app.get("/get_graph_data/", dependencies = [Depends(cookie)])
async def get_graph_data(session_id:SessionData = Depends(verifier)):
    try:
        statement = "SELECT Date_Payed, SUM(Amount_Owned) AS DaySum FROM gp_db.User_Transactions WHERE User_Transactions.User_Id ='{u_Id}' AND User_Transactions.Status = 1  GROUP BY Date_Payed ORDER BY Date_Payed".format(u_Id = session_id.Id)
        return(getResult(statement))
    except Exception as e:
        print(e)

@app.post("/update_transaction_status", dependencies = [Depends(cookie)])
async def update_transaction_status(transaction_Id:Transaction_Id, session_id :SessionData=Depends(verifier)):
    try:
        statement ="UPDATE gp_db.User_Transactions SET Status = 1, Date_Payed='{d_payed}' WHERE Transaction_Id = '{t_id}' AND User_Id= '{u_id}'".format(t_id = transaction_Id.transaction_id, u_id=session_id.Id, d_payed=date.today())
        updateTable(statement)
        statement = "SELECT COUNT(Status) FROM gp_db.User_Transactions WHERE Status = 0 AND Transaction_Id = '{t_id}'".format(t_id = transaction_Id.transaction_id)
        result = getTableResult(statement)
        if result[0][0] == 0:
            statement = "UPDATE gp_db.Transactions SET Status = True WHERE Transaction_Id ='{t_id}'".format(t_id = transaction_Id.transaction_id)
            updateTable(statement)
    except Exception as e:
        print(e)

@app.post("/leave_group", dependencies=[Depends(cookie)])
async def leave_group(group_id:GroupId, session_id:SessionData=Depends(verifier)):
    try:
        statement="DELETE FROM gp_db.Groups_Users WHERE Group_Id='{g_id}' AND User_Id = '{u_id}'".format(g_id=group_id.group_id, u_id=session_id.Id)
        updateTable(statement)
    except Exception as e:
        print(e)
@app.post("/delete_group", dependencies = [Depends(cookie)])
async def delete_group(group_id:GroupId, session_id:SessionData=Depends(verifier)):
    try:
        statement = "DELETE FROM gp_db.Groups WHERE Group_Id='{g_id}' and Group_Owner = '{u_id}'".format(g_id=group_id.group_id, u_id=session_id.Id)
        updateTable(statement)
    except Exception as e:
        print(e)

@app.post("/get_transaction_user_status", dependencies=[Depends(cookie)])
async def get_transaction_user_status(transaction_id : Transaction_Id , session_id:SessionData=Depends(verifier)):
    try:
        statement="SELECT CASE WHEN Status = 0 THEN 'false' WHEN Status >0 THEN 'true' END AS 'Status' FROM gp_db.User_Transactions WHERE User_Id='{u_id}' AND Transaction_Id='{t_id}'".format(u_id = str(session_id.Id), t_id=transaction_id.transaction_id)
        return(getResult(statement))
    except Exception as e:
        print(e)

def getTableResult(statement:str):
    cursor.execute(statement)
    result = cursor.fetchall()
    return result

def getResult(statement: str):
    cursor.execute(statement)
    columns = cursor.description 
    result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cursor.fetchall()]
    return result

def insertRow(statement: str, statementData:str):
    cursor.execute(statement, statementData)
    connection.commit()

def updateTable(statement: str):
    cursor.execute(statement)
    connection.commit()
