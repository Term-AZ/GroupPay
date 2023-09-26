import time;
import sys;
import mysql.connector
# from fastapi import FastAPI
import uvicorn

# app = FastAPI()

# connection = mysql.connector.connect(
#     host = 'GroupPayDB', port = 3306, db='TestDataBase', user = 'root',password = '123'
# )

# @app.get("/")
# async def root():
#     response ={
#         "channel":"The show",
#         "tutorial":"React, Flask and do"
#     }
#     #return "hello! hello!!"
#     return response
# @app.route('/', methods=['GET'])
# def index():
#     return{
#         "channel":"The show",
#         "tutorial":"React, Flask and do"
#     }

# def testQuery():
#     cursor = connection.cursor()
#     cursor.execute('SELECT * FROM TestTable')
#     users = cursor.fetchall()
#     return users


# if __name__ == "__main__":
#     uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)
