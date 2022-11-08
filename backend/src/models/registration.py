from flask_cors import CORS
import app_configuration as appConf
import reg_model as registrationModel
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
import hashlib
from werkzeug.security import generate_password_hash
import os
import sys
sys.path.append(os.getcwd())


app = Flask(__name__)
CORS(app)
api = Api(app)


db = SQLAlchemy(app)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


class Users(db.Model):
    __tablename__ = "registrationtable"
    username = db.Column(db.String(25), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    emailid = db.Column(db.String(100), primary_key=True, nullable=False)
    licensenumber = db.Column(db.String(10), unique=True, nullable=False)


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

        print(inputJson)
        return registrationModel.insertDataIntoTable(appConf.registrationtableName, inputJson["firstName"], inputJson["lastName"], inputJson["email"], inputJson["password"], inputJson["mobileNumber"], inputJson["licenseNumber"])


@app.route('/registerpage', methods=['GET', 'POST'])
def signup_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = Users(username=data['username'], password=hashed_password,
                     emailid=data['emailid'], licensenumber=data['licensenumber'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'registered successfully'})


class updatePassword(Resource):
    def post(self):
        inputJson = request.get_json()
        print(inputJson)
        return registrationModel.updatePassword(appConf.registrationtableName, inputJson["email"], inputJson["password"], inputJson["updatePassword"])


api.add_resource(updatePassword, "/updatePassword")

api.add_resource(DBConnection, "/getDbConnection")
api.add_resource(DropRegistrationTable, "/dropRegistrationTable")
api.add_resource(FetchAllUserData, "/usersData")
api.add_resource(CreateRegistrationTable, "/createRegistrationtable")
api.add_resource(InsertRegistrationData, "/addNewRegistration")

if __name__ == '__main__':
    app.run(debug=True)
