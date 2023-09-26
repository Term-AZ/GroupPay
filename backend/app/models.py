from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str
    confirmPass: str
    email: str 

class LoginUser(BaseModel):
    email: str
    password: str
    
class SessionData(BaseModel):
    Id: str

class GroupId(BaseModel):
    group_id:str

class UserEmail(BaseModel):
    email:str

class AddUserToGroup(BaseModel):
    group_id:str
    email:str

class EditGroup(BaseModel):
    group_name:str
    g_id:str

class NewGroup(BaseModel):
    group_name: str

class TransactionData(BaseModel):
    transaction:object
    transactionName: str
    transactionEmail:str
    group_id: str

class Transaction_Id(BaseModel):
    transaction_id:str

class Update_Transacton(BaseModel):
    transaction:object
    transaction_name :str
    transaction_id: str