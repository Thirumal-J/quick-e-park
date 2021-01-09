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
import app_configuration as appConf
import update_model as update
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
        return update.getDbConnection()


class updateProfileData(Resource):
    def post(self):
        name = ""
        surname = ""
        email = ""
        mobileno = ""
        inputJson = request.get_json()
        name = inputJson["firstName"]
        surname = inputJson["lastName"]
        email = inputJson["email"]
        mobileno = inputJson["mobileNumber"]

        return update.UpdateUsertable(appConf.registrationtableName,name,surname,email,mobileno)

class showVehicleData(Resource):
    def post(self):
        inputJson = request.get_json()
        print (inputJson)
        return update.showVehicleData(appConf.vehiclestableName,appConf.registrationtableName,inputJson["email"])

class AddVehicleData(Resource):
    def post(self):

        inputJson = request.get_json()
        return update.addVehicleData(appConf.vehiclestableName,appConf.registrationtableName,inputJson["carRegNumber"],inputJson["vehicleType"],inputJson["email"])

class checkOwner(Resource):
    def post(self):
        inputJson = request.get_json()
        print (inputJson)
        return update.checkOwner(appConf.vehiclestableName,appConf.registrationtableName,inputJson["carRegNumber"])

api.add_resource(checkOwner,"/checkOwner")
api.add_resource(DBConnection,"/getDbConnection")
api.add_resource(updateProfileData,"/updateProfileData")
api.add_resource(showVehicleData,"/showVehicleData")
api.add_resource(AddVehicleData,"/addVehicleData")


if __name__ == '__main__':  
     app.run(debug=True)