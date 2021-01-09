#exception message printing pending
from flask import Flask
import psycopg2
import json
from flask import request
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import retcommon_status
import statuswho

app=Flask(__name__)

DB_HOST="192.168.99.100"
DB_NAME="QuickEPark"
DB_USER="postgres"
DB_PASS="Pass@123"


User_table="Users"

@app.route("/")
def index():
    return "Hello!! This is reset password api"


@app.route("/createpassword_new",methods=['POST'])
def createpassword_new():
    result=-1
    status="default"
    status_who=""
    try:
        Username=request.json["email"]
        Password=request.json["Password"]
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
        SQL_checkuser="select 1 from "+ User_table +" where Username in ('"+ Username +"')"
        cur.execute(SQL_checkuser)

        if(cur.fetchall()[0][0]==1):
            try:
                SQL="update "+ User_table +" set PasswordHash='"+ Password +"' where Username='"+Username+"'"
                cur.execute(SQL)
                #result=cur.fetchall()
                status="success"
                status_who=statuswho.INSERTION_PASSWORD_SUCCESS
            except:
                status="error"
                status_who=statuswho.TABLE_DOESNOT_EXIST
        else:
            status="error"
            status_who=statuswho.INSERTION_PASSWORD_FAIL
        conn.commit()
        conn.close()
    return retcommon_status.createJSONResponse(status,status_who)


@app.route("/resetpassword",methods=['POST'])
def resetpassword():
    result=-1
    status="default"
    status_who=""
    try:
        Username=request.json["email"]
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
            SQL="select email from "+ User_table +" where email in ('"+ Username +"')"
            cur.execute(SQL)
            result=cur.fetchall()
        except:
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
        if result==[]:
            result=0
            status="error"
            status_who=statuswho.LOGIN_STATUS_FAIL
        else:
            result=result[0][0]
            email_flag=SendEmail(result)
            if email_flag==0:
                status="success"
                status_who=statuswho.EMAIL_STATUS_SUCCESS
            else:
                status="error"
                status_who=statuswho.EMAIL_STATUS_FAILED
        conn.commit()
        conn.close()
        
    if result==[]:
        result=-1
    return retcommon_status.createJSONResponse(status,status_who,str(result))

def SendEmail(EmailId):
    try:
        html_string=""
        with open('EmailTemplate.html', 'r') as f: 
            html_string = f.read()
        #mail_content = 'Body'
        mail_content=html_string
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
        flag=0
    except Exception as e:
        flag="1"
        print(e)
    return flag


if __name__=="__main__":
    app.run(port=5001,debug=True)