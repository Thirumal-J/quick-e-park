#exception message printing pending
from flask import Flask,make_response,request,jsonify
import psycopg2
import json
import jwt
import datetime
from functools import wraps
import statuswho
import retcommon_status
import parking_fare

app=Flask(__name__)

app.config['SECRET_KEY']='secret'

User_table="tbl_user"
parking_table="tbl_parkdetails"
activepark_view="uv_getparkdetails"
totalFare_View="uv_totalfare"

# DB_HOST="192.168.99.100"
# DB_NAME="ARPB"
# DB_USER="postgres"
# DB_PASS="Password"

DB_HOST="localhost"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASS="Password"

@app.route("/")
def index():
    return "Hello!! This is buy ticket api"

@app.route("/viewTicketUser",methods=['POST'])
def viewticket():
    result=-1
    # jsonresult={}
    jsonresult=[]
    status="default"
    email=""
    status_who=""
    parkdate=""
    timeremaining=""
    parkinglocation=""
    parkingfare=""
    parkedcarregno=""
    parkingEmail=""
    # carregno=""
    # minutesparking=""
    # parkloc=""
    uid_temp=""
    uid=""
    try:
        email=request.json["email"]
        status="success"
    except:
        status="error"
        status_who=statuswho.JSON_INPUT_INCORRECT
    try:
        conn =psycopg2.connect(dbname=DB_NAME,user=DB_USER,password=DB_PASS,host=DB_HOST)
        cur=conn.cursor()
    except:
        status="error"
        status_who=statuswho.DB_CONNECTION_FAILED
    if status=="success":
        try:
            SQL="select uid from "+ User_table +" where email in ('"+ email +"')"
            cur.execute(SQL)
            uid_temp=cur.fetchall()
            if uid_temp==[]:
                result="No user found"
                status="error"
                status_who=statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid=str(uid_temp[0][0])
                    SQL="select 1 from "+ activepark_view + " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result=cur.fetchall()
                    if result==[]:
                        status="error"
                        status_who=statuswho.NO_DATA_TO_DISPLAY
                    else:
                        try:
                            SQL="select parkingstartdate,timeremaining,parkinglocation,parkingfare,parkedcarregno,parkingEmail from " + activepark_view + " where uid in ('" + uid + "')"
                            cur.execute(SQL)
                            result=cur.fetchall()
                            for i in range(len(result)):
                                parkdate=str(result[i][0])
                                timeremaining=str(result[i][1])
                                parkinglocation=str(result[i][2])
                                parkingfare=str(result[i][3])
                                parkedcarregno=str(result[i][4])
                                parkingEmail=str(result[i][5]) 
                                # if(len(jsonresult) is None):                               
                                #     jsonresult={"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail}
                                # else:
                                #     jsonresult=jsonresult+{"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail}
                                jsonresult.append({"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail})
                            # jsonresult='{"parkdate":"'+parkdate+'","timeremaining":"'+ timeremaining+'", "parkinglocation:"'+parkinglocation+'", "parkingfare:"'+parkingfare+'", "parkedcarregno""'+parkedcarregno +'"}'
                            status="success"
                            status_who=statuswho.GENERIC_STATUS
                        except:
                            status_who=statuswho.TABLE_DOESNOT_EXIST
                            status="error"
                except:
                    status="error"
                    status_who=statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
    if result==[]:
            result=-1
    return retcommon_status.createJSONResponse(status,status_who,jsonresult)

@app.route("/buyticket",methods=['POST'])
#@token_required
def buyticket():
    result=-1
    status="default"
    email=""
    carregno=""
    minutesparking=""
    parkloc=""
    uid_temp=""
    uid=""
    parkingfare=""
    jsonresult={}
    parkingEmail=""
    try:
        email=request.json["email"]
        carregno=request.json["parkedCarRegNo"]
        minutesparking=request.json["parkingDuration"]
        parkloc=request.json["parkedLocation"] 
        if(request.json["parkingEmail"]):
            parkingEmail=request.json["parkingEmail"]
        else:
            parkingEmail=email
        status="success"
        parkingfare=float(parking_fare.calfare(minutesparking))
    except:
        status="error"
        status_who=statuswho.JSON_INPUT_INCORRECT
    try:
        conn =psycopg2.connect(dbname=DB_NAME,user=DB_USER,password=DB_PASS,host=DB_HOST)
        cur=conn.cursor()
    except:
        status="error"
        status_who=statuswho.DB_CONNECTION_FAILED
    if status=="success":
        try:
            SQL="select uid from "+ User_table +" where email in ('"+ email +"')"
            cur.execute(SQL)
            uid_temp=cur.fetchall()
            if uid_temp==[]:
                result="No user found"
                status="error"
                status_who=statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid=str(uid_temp[0][0])
                    SQL="select 1 from "+ parking_table + " where uid in ('" + uid + "') and parkedcarregno in ('" + carregno + "')"
                    #SQL="select 1 from " + parking_table + " where uid in ('"+ uid + "')"# and ParkedCarRegNo in ('"+ carregno +"') and parkingactive in ('1')"
                    print(SQL)
                    cur.execute(SQL)
                    result=cur.fetchall()
                    if result==[]:
                        try:
                            SQL="insert into " + parking_table + " values( " + uid + " , '1',  now(), now() + interval '1' minute * "+ minutesparking + ",'"+ parkloc +"','"+str(parkingfare)+"','" + carregno+"','" + parkingEmail+"')"
                            print(SQL)
                            cur.execute(SQL)
                            status="success"
                            status_who=statuswho.PARKING_SUCCESSFUL
                            jsonresult={"parkingFare":parkingfare}
                        except:
                            status_who=statuswho.PARKING_INSERTION_FAILED
                            status="error"
                    else:
                        status="error"
                        status_who=statuswho.PARKING_ALREADY_EXISTS
                except:
                    status="error"
                    status_who=statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
    if result==[]:
            result=-1
    return retcommon_status.createJSONResponse(status,status_who,jsonresult)


@app.route("/extendTicket",methods=['POST'])
def extendticket():
    result=-1
    status="default"
    status_who=""
    email=""
    carregno=""
    minutesextended=""
    parkloc=""
    uid_temp=""
    uid=""
    parkingfare=""
    parkingemail=""
    parkingStartDate=""
    parkingEndDate=""
    parkingfare_new=""
    jsonresult={}
    try:
        email=request.json["email"]
        carregno=request.json["parkedCarRegNo"]
        # parkStartDate=request.json["parking"]
        minutesextended=request.json["timeToExtend"]
        # parkloc=request.json["parkedLocation"]
        parkingemail=request.json["parkingEmail"]
        status="success"
        #parkingfare=float(parking_fare.calfare(minutesextended))
    except:
        status="error"
        status_who=statuswho.JSON_INPUT_INCORRECT
    try:
        conn =psycopg2.connect(dbname=DB_NAME,user=DB_USER,password=DB_PASS,host=DB_HOST)
        cur=conn.cursor()
    except:
        status="error"
        status_who=statuswho.DB_CONNECTION_FAILED
    if status=="success":
        try:
            SQL="select uid from "+ User_table +" where email in ('"+ email +"')"
            cur.execute(SQL)
            uid_temp=cur.fetchall()
            if uid_temp==[]:
                result="No user found"
                status="error"
                status_who=statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid=str(uid_temp[0][0])
                    try:
                        SQL="select parkingstartdate,parkingenddate,parkingfare,extract(epoch from (parkingenddate-parkingstartdate) / 60 ) from "+ parking_table + " where uid in ('" + uid + "') and parkedcarregno in ('"+carregno+"') and parkingemail in ('"+str(parkingemail)+"')"
                        cur.execute(SQL)
                        result=cur.fetchall()
                    
                        parkingStartDate=result[0][0]
                        parkingEndDate=result[0][1]
                        parkingfare=result[0][2]
                        parkingtime_temp=result[0][3]
                        parkingtime_new=parkingtime_temp+int(minutesextended)
                        parkingfare_new=parking_fare.calfare(parkingtime_new)
                    except:
                        status="error"
                        status_who=statuswho.NO_DATA_TO_DISPLAY
                        
                    SQL="update tbl_parkdetails set parkingfare='"+ str(parkingfare_new) +"',parkingenddate=(parkingenddate+interval '1' minute * '"+ str(minutesextended)+ "') where parkingactive='1' and parkedcarregno in ('"+str(carregno)+"') and parkingemail in ('"+str(parkingemail)+"')"
                    cur.execute(SQL)
                    status="success"
                    status_who=statuswho.PARKING_SUCCESSFUL
                    jsonresult={"parkingFare":parkingfare_new}
                    #result=cur.fetchall()
                except:
                    status="error"
                    status_who=statuswho.UPDATE_DATA_FAILED
            conn.commit()
            conn.close()
        except:
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
    if result==[]:
            result=-1
    return retcommon_status.createJSONResponse(status,status_who,jsonresult)

@app.route("/viewTicketChecker",methods=['POST'])
def viewTicketChecker():
    result=-1
    # jsonresult={}
    jsonresult={}
    status="default"
    email=""
    status_who=""
    parkdate=""
    timeremaining=""
    parkinglocation=""
    parkingfare=""
    parkedcarregno=""
    parkingEmail=""
    uid_temp=""
    uid=""
    try:
        email=request.json["email"]
        status="success"
    except:
        status="error"
        status_who=statuswho.JSON_INPUT_INCORRECT
    try:
        conn =psycopg2.connect(dbname=DB_NAME,user=DB_USER,password=DB_PASS,host=DB_HOST)
        cur=conn.cursor()
    except:
        status="error"
        status_who=statuswho.DB_CONNECTION_FAILED
    if status=="success":
        try:
            SQL="select uid from "+ User_table +" where email in ('"+ email +"')"
            cur.execute(SQL)
            uid_temp=cur.fetchall()
            if uid_temp==[]:
                result="No user found"
                status="error"
                status_who=statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid=str(uid_temp[0][0])
                    SQL="select 1 from "+ activepark_view + " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result=cur.fetchall()
                    if result==[]:
                        status="error"
                        status_who=""
                    else:
                        try:
                            SQL="select parkingstartdate,timeremaining,parkinglocation,parkingfare,parkedcarregno,parkingEmail from " + activepark_view + " where uid in ('" + uid + "')"
                            cur.execute(SQL)
                            result=cur.fetchall()
                            for i in range(len(result)):
                                parkdate=str(result[i][0])
                                timeremaining=str(result[i][1])
                                parkinglocation=str(result[i][2])
                                parkingfare=str(result[i][3])
                                parkedcarregno=str(result[i][4])
                                parkingEmail=str(result[i][5]) 
                                # if(len(jsonresult) is None):                               
                                #     jsonresult={"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail}
                                # else:
                                #     jsonresult=jsonresult+{"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail}
                                jsonresult.append({"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail})
                            # jsonresult='{"parkdate":"'+parkdate+'","timeremaining":"'+ timeremaining+'", "parkinglocation:"'+parkinglocation+'", "parkingfare:"'+parkingfare+'", "parkedcarregno""'+parkedcarregno +'"}'
                            status="success"
                            status_who=statuswho.GENERIC_STATUS
                        except:
                            status_who=statuswho.TABLE_DOESNOT_EXIST
                            status="error"
                except:
                    status="error"
                    status_who=statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
    if result==[]:
            result=-1
    return retcommon_status.createJSONResponse(status,status_who,jsonresult)


@app.route("/viewTotalFare",methods=['POST'])
def viewTotalFare():
    result=-1
    # jsonresult={}
    jsonresult={}
    status="default"
    email=""
    status_who=""
    parkdate=""
    timeremaining=""
    parkinglocation=""
    parkingfare=""
    parkedcarregno=""
    parkingEmail=""
    uid_temp=""
    uid=""
    try:
        email=request.json["email"]
        status="success"
    except:
        status="error"
        status_who=statuswho.JSON_INPUT_INCORRECT
    try:
        conn =psycopg2.connect(dbname=DB_NAME,user=DB_USER,password=DB_PASS,host=DB_HOST)
        cur=conn.cursor()
    except:
        status="error"
        status_who=statuswho.DB_CONNECTION_FAILED
    if status=="success":
        try:
            SQL="select uid from "+ User_table +" where email in ('"+ email +"')"
            cur.execute(SQL)
            uid_temp=cur.fetchall()
            if uid_temp==[]:
                result="No user found"
                status="error"
                status_who=statuswho.LOGIN_STATUS_FAIL
            else:
                try:
                    uid=str(uid_temp[0][0])
                    SQL="select 1 from "+ activepark_view + " where uid in ('" + uid + "')"
                    cur.execute(SQL)
                    result=cur.fetchall()
                    if result==[]:
                        status="error"
                        status_who=""
                    else:
                        try:
                            SQL="select parkingstartdate,timeremaining,parkinglocation,parkingfare,parkedcarregno,parkingEmail from " + activepark_view + " where uid in ('" + uid + "')"
                            cur.execute(SQL)
                            result=cur.fetchall()
                            for i in range(len(result)):
                                parkdate=str(result[i][0])
                                timeremaining=str(result[i][1])
                                parkinglocation=str(result[i][2])
                                parkingfare=str(result[i][3])
                                parkedcarregno=str(result[i][4])
                                parkingEmail=str(result[i][5]) 
                                # if(len(jsonresult) is None):                               
                                #     jsonresult={"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail}
                                # else:
                                #     jsonresult=jsonresult+{"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail}
                                jsonresult.append({"parkingStartDate":parkdate,"remainingParkingDuration":timeremaining, "parkingLocation":parkinglocation, "parkingFare":parkingfare, "parkedCarRegNo":parkedcarregno,"parkingEmail":parkingEmail})
                            # jsonresult='{"parkdate":"'+parkdate+'","timeremaining":"'+ timeremaining+'", "parkinglocation:"'+parkinglocation+'", "parkingfare:"'+parkingfare+'", "parkedcarregno""'+parkedcarregno +'"}'
                            status="success"
                            status_who=statuswho.GENERIC_STATUS
                        except:
                            status_who=statuswho.TABLE_DOESNOT_EXIST
                            status="error"
                except:
                    status="error"
                    status_who=statuswho.TABLE_DOESNOT_EXIST
            conn.commit()
            conn.close()
        except:
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
    if result==[]:
            result=-1
    return retcommon_status.createJSONResponse(status,status_who,jsonresult)

if __name__=="__main__":
    app.run(port=5004,debug=True)