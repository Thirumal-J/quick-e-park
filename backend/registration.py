from flask import Flask, request, redirect, url_for, session, jsonify
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import socket
import json
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
import os, sys
sys.path.append(os.getcwd())
import reg_model as registrationModel
import app_configuration as appConf
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
api = Api(app)


db = SQLAlchemy(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

class Users(db.Model):
     __tablename__ = "registrationtable"
     username = db.Column(db.String(25), unique=True, nullable=False)
     password = db.Column(db.String(100), nullable=False)
     emailid = db.Column(db.String(100), primary_key=True, nullable=False)
     licensenumber = db.Column(db.String(10),unique=True, nullable=False)

@app.route('/', methods=['GET'])
def home():
    return "<h1>Hello</p>"


class DBConnection(Resource):
    def get(self):
        return registrationModel.getDbConnection()

class CreateRegistrationTable(Resource):
    def get(self):
        return registrationModel.createRegistrationTable()
        

class FetchAllUserData(Resource):
    def get(self):
        return registrationModel.fetchDataFromTable(appConf.registrationtableName)
        

class DropRegistrationTable(Resource):
    def delete(self):
        return registrationModel.dropTable(appConf.registrationtableName)


class InsertRegistrationData(Resource):
    def post(self):
        inputJson = request.get_json()
        hashed_password = hashlib.sha3_512(inputJson["password"].encode())
        inputJson["password"] = hashed_password.hexdigest()

        print (inputJson)
        return registrationModel.insertDataIntoTable(appConf.registrationtableName,inputJson["firstName"],inputJson["lastName"],inputJson["email"],inputJson["password"],inputJson["mobileNumber"],inputJson["licenseNumber"])

@app.route('/registerpage', methods=['GET', 'POST'])
def signup_user():  
 data = request.get_json()  
 hashed_password = generate_password_hash(data['password'], method='sha256')
 new_user = Users(username=data['username'], password=hashed_password,emailid=data['emailid'],licensenumber=data['licensenumber']) 
 db.session.add(new_user)  
 db.session.commit()    
 return jsonify({'message': 'registered successfully'})


#/*@app.route('/register', methods =['GET', 'POST']) 
#def register(): 
    #msg = '' 
    #if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form : 
        #username = request.form['username'] 
        #password = request.form['password'] 
        #email = request.form['email'] 
        #cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor) 
        #cursor.execute('SELECT * FROM accounts WHERE username = % s', (username, )) 
        #account = cursor.fetchone() 
       # if account: 
         #   msg = 'Account already exists !'
        #elif not re.match(r'[^@]+@[^@]+\.[^@]+', email): 
         #   msg = 'Invalid email address !'
        #elif not re.match(r'[A-Za-z0-9]+', username): 
         #   msg = 'Username must contain only characters and numbers !'
        #elif not username or not password or not email: 
         #   msg = 'Please fill out the form !'
        #else: 
       #     cursor.execute('INSERT INTO accounts VALUES (NULL, % s, % s, % s)', (username, password, email, )) 
      #      mysql.connection.commit() 
     #       msg = 'You have successfully registered !'
    #elif request.method == 'POST': 
   #     msg = 'Please fill out the form !'
  #  return render_template('register.html', msg = msg) 


class updatePassword(Resource):
    def post(self):
        inputJson = request.get_json()
        print (inputJson)
        return registrationModel.updatePassword(appConf.registrationtableName,inputJson["email"],inputJson["password"],inputJson["updatePassword"])

api.add_resource(updatePassword,"/updatePassword")

api.add_resource(DBConnection,"/getDbConnection")
api.add_resource(DropRegistrationTable,"/dropRegistrationTable")
api.add_resource(FetchAllUserData,"/usersData")
api.add_resource(CreateRegistrationTable,"/createRegistrationtable")
api.add_resource(InsertRegistrationData,"/addNewRegistration")

if __name__ == '__main__':  
     app.run(debug=True)