# exception message printing pending
from flask import Flask, request
import psycopg2
import statuswho
import retcommon_status
import parking_fare

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret'

User_table = "tbl_user"
parking_table = "tbl_parkdetails"
activepark_view = "uv_getparkdetails"
totalFare_View = "uv_totalfare"

DB_HOST = "localhost"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "Password"


@app.route("/")
def index():
    return "Hello!! This is buy ticket api"


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
                        " where uid in ('" + uid + \
                        "') and parkedcarregno in ('" + carregno + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    if result == []:
                        try:
                            SQL = "insert into " + parking_table + " values( " + uid + " , '1',  now(), now() + interval '1' minute * " + \
                                minutesparking + ",'" + parkloc + "','" + \
                                str(parkingfare)+"','" + carregno + \
                                "','" + parkingEmail+"')"
                            cur.execute(SQL)
                            status = "success"
                            status_who = statuswho.PARKING_SUCCESSFUL
                            jsonresult = {"parkingFare": parkingfare}
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
    parkingemail = ""
    parkingfare_new = ""
    jsonresult = {}
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
                        result[0][2]
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
                    jsonresult = {"parkingFare": parkingfare_new}
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


@app.route("/viewTicketChecker", methods=['POST'])
def viewTicketChecker():
    result = -1
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
                        status_who = ""
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


@app.route("/viewTotalFare", methods=['POST'])
def viewTotalFare():
    result = -1
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
                        status_who = ""
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


if __name__ == "__main__":
    app.run(port=5004, debug=True)
