import registration_model as registrationModel
from flask import Flask
from flask_restful import Resource, Api
import os
import sys
sys.path.append(os.getcwd())

app = Flask(__name__)
api = Api(app)
app.config["DEBUG"] = True

# Initiates Database Connection
class DBConnection(Resource):
    def get(self):
        return registrationModel.getDbConnection()


# adding resource to the api
api.add_resource(DBConnection, "/getDbConnection")

if __name__ == '__main__':
    app.run()
