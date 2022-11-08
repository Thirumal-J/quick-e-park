# exception message printing pending
from flask import Flask, request
import retcommon_status
import statuswho
import psycopg2

app = Flask(__name__)

User_table = "tbl_user"
parking_table = "tbl_parkdetails"
penalty_table = "tbl_penalty"

DB_HOST = "192.168.99.100"
DB_NAME = "ARPB"
DB_USER = "postgres"
DB_PASS = "Password"


@app.route("/")
def index():
    return "Hello!! This is parking fine api"


@app.route("/viewfine", methods=['POST'])
def viewfine():
    result = -1
    parkingfine = ""
    finedate = ""
    jsonresult = {}
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
                            SQL = "select parkingfine,finedate from " + \
                                penalty_table + " where uid in ('" + uid + "')"
                            cur.execute(SQL)
                            result = cur.fetchall()
                            parkingfine = str(result[0][0])
                            finedate = str(result[0][1])
                            jsonresult = {
                                "parkingfine": parkingfine, "finedate": finedate}
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


@app.route("/putFine", methods=['POST'])
def putFine():
    result = -1
    parkingfine = ""
    finedate = ""
    jsonresult = {}
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
                            SQL = "select parkingfine,finedate from " + \
                                penalty_table + " where uid in ('" + uid + "')"
                            cur.execute(SQL)
                            result = cur.fetchall()
                            parkingfine = str(result[0][0])
                            finedate = str(result[0][1])
                            jsonresult = {
                                "parkingfine": parkingfine, "finedate": finedate}
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


@app.route("/viewTotalFines", methods=['POST'])
def viewTotalFines():
    result = -1
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
                    SQL = "select sum(parkingfine) from " + \
                        penalty_table + " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result = cur.fetchall()
                    if result == []:
                        status = "error"
                        status_who = statuswho.NO_DATA_TO_DISPLAY
                    else:
                        try:
                            jsonresult = {"parkingFine": str(result[0][0])}
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
    app.run(port=5005, debug=True)
