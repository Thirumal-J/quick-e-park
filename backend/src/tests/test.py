# exception message printing pending
import update_model as update
import app_configuration as appConf
import reg_model as registrationModel
from flask import Flask, jsonify, make_response, request
import psycopg2
import jwt
import datetime
from functools import wraps
import statuswho
import retcommon_status
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import parking_fare
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
import os
import sys
sys.path.append(os.getcwd())

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['SECRET_KEY'] = 'secret'

User_table = "tbl_user"
parking_table = "tbl_parkdetails"
activepark_view = "uv_getparkdetails"
penalty_table = "tbl_penalty"
vehicles_table = "tbl_vehicles"
totalFare_View = "uv_totalfare"
history_tabe = "tbl_history"
checker_table = "tbl_checker"


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


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


# DB_HOST="172.25.0.3"
DB_HOST = "databaseall"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "Password"
db = SQLAlchemy(app)


@app.route("/")
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
                    jsonresult = {"authentication": authentication, "email": email, "firstName": firstname,
                                  "lastName": surname, "licenseNumber": licenseNumber, "mobileNumber": mobileNumber}
                except:
                    status_who = statuswho.TABLE_DOESNOT_EXIST
                    status = "error"
            conn.commit()
            conn.close()
        except:
            # print(SQL)
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/viewTicketUser", methods=['POST'])
def viewticket():
    result = -1
    jsonresult = []
    status = "default"
    email = ""
    status_who = ""
    parkdate = ""
    timeremaining = ""
    parkinglocation = ""
    parkingfare = ""
    parkedcarregno = ""
    parkingEmail = ""
    uid_temp = ""
    uid = ""
    try:
        email = request.json["email"]
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
            SQL = "select uid from " + User_table + \
                " where email in ('" + email + "')"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid = str(uid_temp[0][0])
                    SQL = "select 1 from " + activepark_view + \
                        " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    if result == []:
                        status = "error"
                        status_who = statuswho.NO_DATA_TO_DISPLAY
                    else:
                        try:
                            SQL = "select parkingstartdate,timeremaining,parkinglocation,parkingfare,parkedcarregno,parkingEmail from " + \
                                activepark_view + \
                                " where uid in ('" + uid + "')"
                            cur.execute(SQL)
                            result = cur.fetchall()
                            for i in range(len(result)):
                                parkdate = str(result[i][0])
                                timeremaining = str(result[i][1])
                                parkinglocation = str(result[i][2])
                                parkingfare = str(result[i][3])
                                parkedcarregno = str(result[i][4])
                                parkingEmail = str(result[i][5])
                                jsonresult.append({"parkingStartDate": parkdate, "remainingParkingDuration": timeremaining, "parkingLocation": parkinglocation,
                                                  "parkingFare": parkingfare, "parkedCarRegNo": parkedcarregno, "parkingEmail": parkingEmail})
                            status = "success"
                            status_who = statuswho.GENERIC_STATUS
                        except:
                            status_who = statuswho.TABLE_DOESNOT_EXIST
                            status = "error"
                except:
                    status = "error"
                    status_who = statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/buyticket", methods=['POST'])
# @token_required
def buyticket():
    result = -1
    status = "default"
    email = ""
    carregno = ""
    minutesparking = ""
    parkloc = ""
    uid_temp = ""
    uid = ""
    parkingfare = ""
    jsonresult = {}
    parkingEmail = ""
    try:
        email = request.json["email"]
        carregno = request.json["parkedCarRegNo"]
        minutesparking = request.json["parkingDuration"]
        parkloc = request.json["parkedLocation"]
        if (request.json["parkingEmail"]):
            parkingEmail = request.json["parkingEmail"]
        else:
            parkingEmail = email
        status = "success"
        parkingfare = float(parking_fare.calfare(minutesparking))
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
            SQL = "select uid from " + User_table + \
                " where email in ('" + email + "')"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid = str(uid_temp[0][0])
                    SQL = "select 1 from " + parking_table + \
                        " where  parkedcarregno in ('" + carregno + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    if result == []:
                        try:
                            SQL = "insert into " + parking_table + " values( " + uid + " , '1',  now(), now() + interval '1' minute * " + \
                                minutesparking + ",'" + parkloc + "','" + \
                                str(parkingfare)+"','" + carregno + \
                                "','" + parkingEmail+"')"
                            print(SQL)
                            cur.execute(SQL)
                            status = "success"
                            status_who = statuswho.PARKING_SUCCESSFUL
                            jsonresult = {"parkingFare": str(
                                parkingfare) + " EUR"}
                        except:
                            status_who = statuswho.PARKING_INSERTION_FAILED
                            status = "error"
                    else:
                        status = "error"
                        status_who = statuswho.PARKING_ALREADY_EXISTS
                except:
                    status = "error"
                    status_who = statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


def createpassword_new():
    status = "default"
    status_who = ""
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
        SQL_checkuser = "select 1 from " + User_table + \
            " where Username in ('" + Username + "')"
        cur.execute(SQL_checkuser)

        if (cur.fetchall()[0][0] == 1):
            try:
                SQL = "update " + User_table + " set Password='" + \
                    Password + "' where email='"+Username+"'"
                cur.execute(SQL)
                status = "success"
                status_who = statuswho.INSERTION_PASSWORD_SUCCESS
            except:
                status = "error"
                status_who = statuswho.TABLE_DOESNOT_EXIST
        else:
            status = "error"
            status_who = statuswho.INSERTION_PASSWORD_FAIL
        conn.commit()
        conn.close()
    return retcommon_status.createJSONResponse(status, status_who)


@app.route("/resetpassword", methods=['POST'])
def resetpassword():
    result = -1
    status = "default"
    status_who = ""
    try:
        Username = request.json["email"]
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
            SQL = "select email from " + User_table + \
                " where email in ('" + Username + "')"
            cur.execute(SQL)
            result = cur.fetchall()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
        if result == []:
            result = 0
            status = "error"
            status_who = statuswho.LOGIN_STATUS_FAIL
        else:
            result = result[0][0]
            email_flag = SendEmail(result)
            if email_flag == 0:
                status = "success"
                status_who = statuswho.EMAIL_STATUS_SUCCESS
            else:
                status = "error"
                status_who = statuswho.EMAIL_STATUS_FAILED
        conn.commit()
        conn.close()

    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, str(result))


def SendEmail(EmailId):
    try:
        html_string = ""
        with open('EmailTemplate.html', 'r') as f:
            html_string = f.read()
        #mail_content = 'Body'
        mail_content = html_string
        sender_address = 'mmicroservice@gmail.com'
        sender_pass = 'mmicroservice@123'
        receiver_address = EmailId
        message = MIMEMultipart()
        message['From'] = sender_address
        message['To'] = receiver_address
        message['Subject'] = 'Reset Password - Quick E Park'
        message.attach(MIMEText(mail_content, 'html'))
        session = smtplib.SMTP('smtp.gmail.com', 587)
        session.starttls()
        session.login(sender_address, sender_pass)
        text = message.as_string()
        session.sendmail(sender_address, receiver_address, text)
        session.quit()
        flag = 0
    except Exception as e:
        flag = "1"
        print(e)
    return flag


@app.route("/viewFinesUser", methods=['POST'])
def viewfine():
    result = -1
    parkingfine = ""
    finedate = ""
    jsonresult = []
    paidstatus = ""
    try:
        email = request.json["email"]
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
            SQL = "select uid from " + User_table + \
                " where email in ('" + email + "')"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid = str(uid_temp[0][0])
                    SQL = "select 1 from " + penalty_table + \
                        " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    if result == []:
                        status = "error"
                        status_who = statuswho.NO_DATA_TO_DISPLAY
                    else:
                        try:
                            SQL = "select parkingfine,finedate,carregistrationno,paidstatus from " + \
                                penalty_table + " where uid in ('" + uid + "')"
                            cur.execute(SQL)
                            result = cur.fetchall()
                            for i in range(len(result)):
                                parkingfine = str(result[i][0])
                                finedate = str(result[i][1])
                                carregistrationno = str(result[i][2])
                                paidstatus = str(result[i][3])
                                if (paidstatus == "0"):
                                    paidstatus = "Not Paid"
                                else:
                                    paidstatus = "Paid"
                                jsonresult.append({"parkingFine": parkingfine, "fineDate": finedate,
                                                  "carRegistrationNo": carregistrationno, "paidStatus": paidstatus})

                            status = "success"
                            status_who = statuswho.GENERIC_STATUS
                        except:
                            status_who = statuswho.TABLE_DOESNOT_EXIST
                            status = "error"
                except:
                    status = "error"
                    status_who = statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/extendTicket", methods=['POST'])
def extendticket():
    result = -1
    status = "default"
    status_who = ""
    email = ""
    carregno = ""
    minutesextended = ""
    uid_temp = ""
    uid = ""
    parkingfare = ""
    parkingemail = ""
    parkingfare_new = ""
    jsonresult = []
    try:
        email = request.json["email"]
        carregno = request.json["parkedCarRegNo"]
        minutesextended = request.json["timeToExtend"]
        parkingemail = request.json["parkingEmail"]
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
            SQL = "select uid from " + User_table + \
                " where email in ('" + email + "')"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid = str(uid_temp[0][0])
                    try:
                        SQL = "select parkingstartdate,parkingenddate,parkingfare,extract(epoch from (parkingenddate-parkingstartdate) / 60 ) from " + \
                            parking_table + \
                            " where uid in ('" + uid + "') and parkedcarregno in ('" + \
                            carregno + \
                            "') and parkingemail in ('"+str(parkingemail)+"')"
                        cur.execute(SQL)
                        result = cur.fetchall()
                        result[0][0]
                        result[0][1]
                        parkingfare = result[0][2]
                        parkingtime_temp = result[0][3]
                        parkingtime_new = parkingtime_temp+int(minutesextended)
                        parkingfare_new = parking_fare.calfare(parkingtime_new)
                    except:
                        status = "error"
                        status_who = statuswho.NO_DATA_TO_DISPLAY

                    SQL = "update tbl_parkdetails set parkingfare='" + str(parkingfare_new) + "',parkingenddate=(parkingenddate+interval '1' minute * '" + str(
                        minutesextended) + "') where parkingactive='1' and parkedcarregno in ('"+str(carregno)+"') and parkingemail in ('"+str(parkingemail)+"')"
                    cur.execute(SQL)
                    status = "success"
                    status_who = statuswho.PARKING_SUCCESSFUL
                    SQL = "select parkingstartdate,timeremaining,parkinglocation,parkingfare,parkedcarregno,parkingEmail from " + \
                        activepark_view + " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    for i in range(len(result)):
                        parkdate = str(result[i][0])
                        timeremaining = str(result[i][1])
                        parkinglocation = str(result[i][2])
                        parkingfare = str(result[i][3])
                        parkedcarregno = str(result[i][4])
                        parkingEmail = str(result[i][5])
                        jsonresult.append({"parkingStartDate": parkdate, "remainingParkingDuration": timeremaining, "parkingLocation": parkinglocation,
                                          "parkingFare": parkingfare, "parkedCarRegNo": parkedcarregno, "parkingEmail": parkingEmail})

                except:
                    status = "error"
                    status_who = statuswho.UPDATE_DATA_FAILED
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/issueFine", methods=['POST'])
def putFine():
    result = -1
    parkingfine = ""
    jsonresult = {}
    parkedcarregno = ""
    checkerId = ""
    try:
        parkedcarregno = request.json["parkedCarRegNo"]
        parkingfine = request.json["parkingFine"]
        checkerId = request.json["empId"]
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
            SQL = "select uid from " + vehicles_table + \
                " where carregistrationno in ('" + parkedcarregno + \
                "') and vehicletype='owner'"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No car owner found"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid = str(uid_temp[0][0])
                    SQL = "insert into " + penalty_table + \
                        " values ('" + uid + "', '" + parkingfine + "' , ' " + \
                        parkedcarregno + "', now() , '0' ,"+checkerId+")"
                    cur.execute(SQL)
                    status = "success"
                    status_who = statuswho.GENERIC_STATUS
                except:
                    status = "error"
                    status_who = statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/viewTicketChecker", methods=['POST'])
def viewTicketChecker():
    result = -1
    # jsonresult={}
    jsonresult = {}
    status = "default"
    email = ""
    status_who = ""
    parkdate = ""
    timeremaining = ""
    parkinglocation = ""
    parkingfare = ""
    parkedcarregno = ""
    parkingEmail = ""
    try:
        parkedcarregno = request.json["parkedCarRegNo"]
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
            SQL = "select ac.parkingstartdate,ac.timeremaining,ac.parkinglocation,ac.parkingfare,ac.parkedcarregno,ac.parkingEmail,u.email from " + vehicles_table + "  as v join " + activepark_view + \
                " as ac on v.uid=ac.uid  join tbl_user as u on u.uid=v.uid  where v.carregistrationno in ('" + \
                parkedcarregno + \
                "') and v.vehicletype='owner' and ac.parkedcarregno in ('" + \
                parkedcarregno + "')"
            cur.execute(SQL)
            result = cur.fetchall()
            if result == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.NO_DATA_TO_DISPLAY
            else:
                try:
                    parkdate = str(result[0][0])
                    timeremaining = str(result[0][1])
                    parkinglocation = str(result[0][2])
                    parkingfare = str(result[0][0])
                    parkedcarregno = str(result[0][4])
                    parkingEmail = str(result[0][5])
                    email = str(result[0][5])
                    jsonresult = {"parkingStartDate": parkdate, "remainingParkingDuration": timeremaining, "parkingLocation": parkinglocation,
                                  "parkingFare": parkingfare, "parkedCarRegNo": parkedcarregno, "parkingEmail": parkingEmail, "email": email}
                    status = "success"
                    status_who = statuswho.GENERIC_STATUS
                except:
                    status_who = statuswho.NO_DATA_TO_DISPLAY
                    status = "error"
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/getPendingPayment", methods=['POST'])
def viewTotal():
    result = -1
    # jsonresult={}
    jsonresult = {}
    status = "default"
    email = ""
    status_who = ""
    uid_temp = ""
    uid = ""
    try:
        email = request.json["email"]
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
            SQL = "select uid from " + User_table + \
                " where email in ('" + email + "')"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.NO_DATA_TO_DISPLAY
            else:
                try:
                    uid = str(uid_temp[0][0])
                    SQL = "select case when sum(parkingfine)>0 then sum(parkingfine) else '0' end from " + \
                        penalty_table + \
                        " where uid in ('" + uid + "') and paidstatus='0'"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    if result == []:
                        status = "error"
                        status_who = statuswho.NO_DATA_TO_DISPLAY
                    else:
                        try:
                            parkingFine = str(result[0][0])
                            SQL = "select case when sum(parkingfare)> 0 then sum(parkingfare) else '0' end from " + \
                                totalFare_View + \
                                " where uid in ('" + uid + "') "
                            cur.execute(SQL)
                            result = cur.fetchall()
                            totalFare = str(result[0][0])
                            jsonresult = {"fineAmount": parkingFine +
                                          " EUR", "ticketAmount": totalFare + " EUR"}
                            status = "success"
                            status_who = statuswho.GENERIC_STATUS
                        except:
                            status_who = statuswho.TABLE_DOESNOT_EXIST
                            status = "error"
                except:
                    status = "error"
                    status_who = statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/getTicketHistory", methods=['POST'])
def getTicketHistory():
    result = -1
    # jsonresult={}
    jsonresult = []
    status = "default"
    email = ""
    SQL = ""
    status_who = ""
    parkinglocation = ""
    parkingfare = ""
    parkedcarregno = ""
    parkingEmail = ""
    name = ""
    uid_temp = ""
    parkingstartdate = ""
    uid = ""
    try:
        email = request.json["email"]
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
            SQL = "select uid from " + User_table + \
                " where email in ('" + email + "')"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.NO_DATA_TO_DISPLAY
            else:
                try:
                    uid = str(uid_temp[0][0])
                    SQL = "select name,surname,email,parkingstartdate,parkingenddate,parkinglocation,parkingfare,parkedcarregno,paidstatus,parkingemail from " + \
                        history_tabe + " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    if result == []:
                        status = "error"
                        status_who = statuswho.NO_DATA_TO_DISPLAY
                    else:
                        try:
                            for i in range(len(result)):
                                name = str(result[i][0])
                                str(result[i][1])
                                email = str(result[i][2])
                                parkingstartdate = str(result[i][3])
                                parkingenddate = str(result[i][4])
                                parkinglocation = str(result[i][5])
                                parkingfare = str(result[i][6])
                                parkedcarregno = str(result[i][7])
                                if str(result[i][8]) == '0':
                                    paidstatus = 'unpaid'
                                else:
                                    paidstatus = 'paid'
                                parkingEmail = str(result[i][9])
                                jsonresult.append({"name": name, "email": email, "parkingStartDate": parkingstartdate, "parkingEndDate": parkingenddate, "parkingLocation": parkinglocation,
                                                  "parkingFare": parkingfare, "parkedCarRegNo": parkedcarregno, "paymentStatus": paidstatus, "parkingEmail": parkingEmail})
                            status = "success"
                            status_who = statuswho.GENERIC_STATUS
                        except:
                            status_who = statuswho.TABLE_DOESNOT_EXIST
                            status = "error"
                except:
                    status = "error"
                    status_who = statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/viewIssuedFine", methods=['POST'])
def viewIssuedFine():
    result = -1
    name = ""
    email = ""
    mobileno = ""
    carRegistrationNo = ""
    fineDate = ""
    paidStatus = ""
    parkingFine = ""
    checkerId = ""
    jsonresult = []
    try:
        checkerId = request.json["empId"]
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
            SQL = "select u.name,u.email,u.mobileno,p.carregistrationno,p.finedate,p.paidstatus,p.parkingfine from " + \
                penalty_table + \
                " p join tbl_user u on p.uid=u.uid where p.issuedcid in ('" + \
                checkerId + "')"
            cur.execute(SQL)
            result = cur.fetchall()
            if result == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    for i in range(len(result)):
                        name = str(result[i][0])
                        email = str(result[i][1])
                        mobileno = str(result[i][2])
                        carRegistrationNo = str(result[i][3])
                        fineDate = str(result[i][4])
                        paidStatus = str(result[i][5])
                        parkingFine = str(result[i][6])
                        if (paidStatus == "0"):
                            paidStatus = "Not Paid"
                        else:
                            paidStatus = "Paid"
                        jsonresult.append({"name": name, "email": email, "mobileNo": mobileno, "parkingFine": parkingFine +
                                          " EUR", "fineDate": fineDate, "carRegistrationNo": carRegistrationNo, "paidStatus": paidStatus})

                    status = "success"
                    status_who = statuswho.GENERIC_STATUS
                except:
                    status = "error"
                    status_who = statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/loginValidChecker", methods=['POST'])
def loginValidChecker():
    result = -1
    status = "default"
    status_who = ""
    Password = ""
    authentication = ""
    firstname = ""
    surname = ""
    email = ""
    mobileNumber = ""
    checkerId = ""
    jsonresult = {}
    try:
        checkerId = request.json["empId"]
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
            SQL = "select 1 from " + checker_table + \
                " where cid in ('" + checkerId + \
                "') and Password in ('" + Password + "')"
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
                    SQL = "select name,surname,email,mobileno,location from " + \
                        checker_table + " where cid in ('" + checkerId + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    firstname = str(result[0][0])
                    surname = str(result[0][1])
                    email = str(result[0][2])
                    mobileNumber = str(result[0][3])
                    location = str(result[0][4])
                    jsonresult = {"authentication": authentication, "empId": checkerId, "email": email,
                                  "firstName": firstname, "lastName": surname, "mobileNumber": mobileNumber, "location": location}
                except:
                    status_who = statuswho.TABLE_DOESNOT_EXIST
                    status = "error"
            conn.commit()
            conn.close()
        except:
            # print(SQL)
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


@app.route("/clearPayment", methods=['POST'])
def clearPayment():
    result = -1
    jsonresult = []
    SQL = ""
    try:
        email = request.json["email"]
        status = "success"
        paymentType = request.json["pendingAmountType"]
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
            SQL = "select uid from " + User_table + \
                " where email in ('" + email + "')"
            cur.execute(SQL)
            uid_temp = cur.fetchall()
            if uid_temp == []:
                result = "No user found"
                status = "error"
                status_who = statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid = str(uid_temp[0][0])
                    if (paymentType == "fineAmount"):
                        SQL = "update  " + penalty_table + \
                            " set paidstatus='1' where uid in ('" + \
                            uid + "') and paidstatus='0'"
                        cur.execute(SQL)
                    elif (paymentType == "ticketAmount"):
                        SQL = "update  " + parking_table + \
                            " set paidstatus='1' where uid in ('" + uid + \
                            "') and parkingactive='0' and paidstatus='0'"
                        cur.execute(SQL)
                        SQL = "update  " + history_tabe + \
                            " set paidstatus='1' where uid in ('" + \
                            uid + "') and paidstatus='0'"
                        cur.execute(SQL)
                    status = "success"
                    status_who = statuswho.GENERIC_STATUS
                except:
                    status = "error"
                    status_who = statuswho.NO_DATA_TO_DISPLAY
            conn.commit()
            conn.close()
        except:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
    if result == []:
        result = -1
    return retcommon_status.createJSONResponse(status, status_who, jsonresult)


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
        return registrationModel.insertDataIntoTable(appConf.registrationtableName, inputJson["firstName"], inputJson["lastName"], inputJson["email"], inputJson["password"], inputJson["mobileNumber"], inputJson["licenseNumber"])


api.add_resource(DBConnection, "/getDbConnection")
api.add_resource(DropRegistrationTable, "/dropRegistrationTable")
api.add_resource(FetchAllUserData, "/usersData")
api.add_resource(CreateRegistrationTable, "/createRegistrationtable")
api.add_resource(InsertRegistrationData, "/addNewRegistration")


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

        return update.UpdateUsertable(appConf.registrationtableName, name, surname, email, mobileno)


class showVehicleData(Resource):
    def post(self):
        inputJson = request.get_json()
        print(inputJson)
        return update.showVehicleData(appConf.vehiclestableName, appConf.registrationtableName, inputJson["email"])


class AddVehicleData(Resource):
    def post(self):

        inputJson = request.get_json()
        return update.addVehicleData(appConf.vehiclestableName, appConf.registrationtableName, inputJson["carRegNumber"], inputJson["vehicleType"], inputJson["email"])


# api.add_resource(DBConnection,"/getDbConnection")
api.add_resource(updateProfileData, "/updateProfileData")
api.add_resource(showVehicleData, "/showVehicleData")
api.add_resource(AddVehicleData, "/addVehicleData")


class checkOwner(Resource):
    def post(self):
        inputJson = request.get_json()
        print(inputJson)
        return update.checkOwner(appConf.vehiclestableName, appConf.registrationtableName, inputJson["carRegNumber"])


api.add_resource(checkOwner, "/checkOwner")


class updatePassword(Resource):
    def post(self):
        inputJson = request.get_json()
        print(inputJson)
        return registrationModel.updatePassword(appConf.registrationtableName, inputJson["email"], inputJson["password"], inputJson["updatePassword"])


api.add_resource(updatePassword, "/updatePassword")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
