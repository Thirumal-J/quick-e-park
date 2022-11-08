# exception message printing pending
from flask import Flask, make_response, request, jsonify
import psycopg2
import jwt
import datetime
from functools import wraps
import statuswho
import retcommon_status

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret'

User_table = "tbl_user"


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'token' in request.headers:
            token = request.headers['token']
        # token=request.args.get('token')
        if not token:
            return jsonify({'message': 'Token missing'}), 403
        try:
            jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'token is invalid'}), 403
        return f(*args, **kwargs)
    return decorated


DB_HOST = "192.168.99.100"
DB_NAME = "ARPB"
DB_USER = "postgres"
DB_PASS = "Password"


@app.route("/")
@token_required
def index():
    return "Hello!! This is login authentication api"


@app.route("/test")
def authe():
    auth = request.authorization

    if auth and auth.password == 'password':
        token = jwt.encode({'user': auth.username, 'exp': datetime.datetime.utcnow(
        ) + datetime.timedelta(minutes=15)}, app.config['SECRET_KEY'])

        return jsonify({'token': token.decode('UTF-8')})
    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})


@app.route("/loginvalid", methods=['POST'])
# @token_required
def loginvalid():
    result = -1
    status = "default"
    status_who = ""
    Username = ""
    Password = ""
    authentication = ""
    firstname = ""
    surname = ""
    email = ""
    licenseNumber = ""
    mobileNumber = ""
    jsonresult = {}
    try:
        Username = request.json["email"]
        Password = request.json["password"]
        status = "success"
    except:
        status = "error"
        status_who = statuswho.JSON_INPUT_INCORRECT
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
        cur = conn.cursor()
    except:
        status = "error"
        status_who = statuswho.DB_CONNECTION_FAILED
    if status == "success":
        try:
            SQL = "select 1 from " + User_table + \
                " where email in ('" + Username + \
                "') and Password in ('"+Password+"')"
            cur.execute(SQL)
            result = cur.fetchall()
            if result == []:
                result = "false"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    status = "success"
                    status_who = statuswho.LOGIN_STATUS
                    authentication = "true"
                    SQL = "select name,surname,email,licenseno,mobileno from " + \
                        User_table + " where email in ('" + Username + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    firstname = str(result[0][0])
                    surname = str(result[0][1])
                    email = str(result[0][2])
                    licenseNumber = str(result[0][3])
                    mobileNumber = str(result[0][4])
                    jsonresult = {"authentication": authentication, "email": email, "firstname": firstname,
                                  "surname": surname, "licenseNumber": licenseNumber, "mobileNumber": mobileNumber}
                except:
                    status_who = statuswho.TABLE_DOESNOT_EXIST
                    status = "error"
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
