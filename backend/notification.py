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
import time

app=Flask(__name__)

# DB_HOST="192.168.99.100"
# DB_NAME="QuickEPark"
# DB_USER="postgres"
# DB_PASS="Pass@123"

DB_HOST="databaseall"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASS="Password"


User_table="Users"
activepark_view="uv_getparkdetails"


def send_Notification():
    result=-1
    status="default"
    status_who=""
    try:
        conn =psycopg2.connect(dbname=DB_NAME,user=DB_USER,password=DB_PASS,host=DB_HOST)
        cur=conn.cursor()
        cur.execute("call sp_updateTransactions();")
        status="success"
        status_who=statuswho.GENERIC_STATUS
    except:
        status="error"
        status_who=statuswho.DB_CONNECTION_FAILED 
    
    if status=="success":
        try:
            SQL="select parkingid,parkingemail from "+ activepark_view +" where timeremaininginminutes<'10' and notificationSent='0'"
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
            for i in range(len(result)):
                #print(result[i][0])
                parkingid=result[i][0]
                parkingemail=result[i][1]
                
                try:
                    SendEmail(parkingemail)
                    SQL="update "+ activepark_view+" set notificationSent='1' where parkingemail in ('"+ parkingemail+"') and parkingid in ('"+parkingid+"')"
                    cur.execute(SQL)
                    
                except:
                    print("notification not sent")
        
        conn.commit()
        conn.close()
        
    if result==[]:
        result=-1
    return 0

def SendEmail(EmailId):
    try:
        html_string=""
        with open('EmailTemplateNotification.html', 'r') as f: 
            html_string = f.read()
        #mail_content = 'Body'
        mail_content=html_string
        sender_address = 'mmicroservice@gmail.com'
        sender_pass = 'mmicroservice@123'
        receiver_address = EmailId
        message = MIMEMultipart()
        message['From'] = sender_address
        message['To'] = receiver_address
        message['Subject'] = '!!!Urgent - Quick E Park !!! Parking ticket expiring ' 
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

while 1:
    print("start")
    send_Notification()
    print("end")
    time.sleep(120)