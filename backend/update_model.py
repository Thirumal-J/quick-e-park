import psycopg2
from psycopg2 import Error
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime, timedelta
import os, sys
sys.path.append(os.getcwd())
import app_configuration as appConf    #Input File for providing DB details, table name, common string formats #Importing Constant variables file
import statuswho
import retcommon_status



class staticVar:
    connection = ""
    cursor = ""
    
def getDbConnection():
    result=-1
    status="default"
    status_who=""
    try:
        #DB Details fetched from the Configuration file
        staticVar.connection = psycopg2.connect(user = appConf.registrationDBConfig["user"],
                                        password = appConf.registrationDBConfig["password"],
                                        host = appConf.registrationDBConfig["host"],
                                        port = appConf.registrationDBConfig["port"],
                                        database = appConf.registrationDBConfig["database"])
        staticVar.cursor = staticVar.connection.cursor()
        status="success"
        status_who=statuswho.DB_CONNECTION_SUCCESS
        return retcommon_status.createJSONResponse(status,status_who,str(result))
    except (Exception, psycopg2.Error) as error :
        status="error"
        status_who=statuswho.DB_CONNECTION_FAILED
        return retcommon_status.createJSONResponse(status,status_who,str(result))
       
def isTableExist(tableName):
    result=-1
    status="default"
    status_who=""
    try:
        getDbConnection()
        table_exist_query = "SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_name ='"+tableName+"');"
        staticVar.cursor.execute(table_exist_query) # Should be logged
        if(staticVar.cursor.fetchone()[0]):
            status="success"
            status_who=statuswho.TABLE_EXIST
            return True
        else:
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
            return False
    except (Exception, psycopg2.DatabaseError) as error :
            status="error"
            status_who=statuswho.DATABASE_ERROR
            return retcommon_status.createJSONResponse(status,status_who,str(result))

def UpdateUsertable(tableName,name,surname,email,mobileno):
    result=-1
    status="default"
    status_who=""
    try:
        if(isTableExist(tableName)):
            status="success"
            if not name is None:
                staticVar.cursor.execute(" UPDATE "+tableName+" SET name ='"+name+"' WHERE email ='"+email+"';")
            else:
                print ("name is null")
            if not surname is None:
                staticVar.cursor.execute(" UPDATE "+tableName+" SET surname ='"+surname+"' WHERE email ='"+email+"';")
            else:
                print ("surname is null")
            if not mobileno is None:
                staticVar.cursor.execute(" UPDATE "+tableName+" SET mobileno ='"+mobileno+"' WHERE email ='"+email+"';")
            else:
                print ("surname is null")

            staticVar.connection.commit()
            status_who=statuswho.UPDATE_TABLE_SUCCESS
            return retcommon_status.createJSONResponse(status,status_who,str(result))
        else:
            status="error"
            status_who=statuswho.UPDATE_TABLE_FAILURE
            return retcommon_status.createJSONResponse(status,status_who,str(result))
    except (Exception, psycopg2.DatabaseError) as error :
            status="error"
            status_who=statuswho.DATABASE_ERROR
            return retcommon_status.createJSONResponse(status,status_who,str(result))
    
    finally:
        closeConnection()


def showVehicleData(tablevehicle,tableuser,email):
    results=-1
    result = -1
    status="default"
    status_who=""
    uservehicleData=""
    try:
       if (isTableExist(tablevehicle) == False):
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
            return retcommon_status.createJSONResponse(status,status_who,str(result))

       #staticVar.cursor =  staticVar.connection.cursor(cursor_factory=RealDictCursor)
       fetch_query = "SELECT carregistrationno,vehicletype FROM "+tablevehicle+" INNER JOIN "+tableuser+ " ON "+tablevehicle+".uid="+tableuser+".uid WHERE email='"+email+"' ;"
       print("*********",fetch_query)
       staticVar.cursor.execute(fetch_query)
       staticVar.connection.commit()
       uservehicleData = staticVar.cursor.fetchall()
       results = []
       carRegNumber=""
       vehicleType=""
       count = 0
       for row in uservehicleData:
            carRegNumber = str(row[0])
            vehicleType = str(row[1])
            #results[count] = {"carRegNumber": carRegNumber,"vehicleType": vehicleType}
            #count = count + 1
            results.append({"carRegNumber": carRegNumber,"vehicleType": vehicleType}) 
       
       staticVar.connection.commit()
       status="success"
       status_who=statuswho.FETCH_ALL_SUCCESS
       return retcommon_status.createJSONResponse(status,status_who,results)
       #results =  uservehicleData
       #return results
    except (Exception, psycopg2.DatabaseError) as error :
            status="error"
            status_who=statuswho.DATABASE_ERROR
            return retcommon_status.createJSONResponse(status,status_who,str(result))
    
    finally:
        closeConnection()

def addVehicleData(tablevehicle,tableusers,carregistrationno,vehicleType,email):
    result=-1
    status="default"
    status_who=""
    checktype=""
    count=0
    counttemp=0
    countown=0
    try:
        if (isTableExist(tablevehicle)==False):
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
            return retcommon_status.createJSONResponse(status,status_who,str(result))

        select_query = "SELECT vehicletype FROM tbl_vehicles WHERE carregistrationno='"+carregistrationno+"' AND vehicletype='owner';"
        print("*********",select_query)
        staticVar.cursor.execute(select_query)
        staticVar.cursor.fetchall()
        count = staticVar.cursor.rowcount
        if not(count == 0):
            if (vehicleType == 'owner'):
                select1_query = "SELECT carregistrationno,vehicletype FROM tbl_vehicles INNER JOIN tbl_user ON tbl_vehicles.uid=tbl_user.uid WHERE email='"+email+"' AND carregistrationno='"+carregistrationno+"' AND vehicletype='owner';"
                staticVar.cursor.execute(select1_query)
                staticVar.cursor.fetchall()
                countown = staticVar.cursor.rowcount
                if not (countown == 0):
                    result = {"registrationMsg": "You are the owner of this vehicle and it already exists in your profile."}
                    status="error"
                    status_who=statuswho.INSERTION_CARREGNO_FAIL
                    return retcommon_status.createJSONResponse(status,status_who,result)
                else:
                    print (str(count)+" Owner already exists for this vehicle.")
                    result = {"registrationMsg": "Owner already exists for the vehicle"}
                    status="error"
                    status_who=statuswho.INSERTION_CARREGNO_FAIL
                    return retcommon_status.createJSONResponse(status,status_who,result)
            else:
                select_query = "SELECT vehicletype FROM tbl_vehicles INNER JOIN tbl_user ON tbl_vehicles.uid=tbl_user.uid WHERE email='"+email+"' AND carregistrationno='"+carregistrationno+"';"
                print("*********",select_query)
                staticVar.cursor.execute(select_query)
                staticVar.cursor.fetchall()
                counttemp = staticVar.cursor.rowcount
                if (counttemp ==  0):
                    insert_query = "INSERT INTO "+tablevehicle+"(uid,carregistrationno,vehicleType,currentactive) VALUES((SELECT uid FROM "+tableusers+" WHERE email='"+email+"'),'"+carregistrationno+"','"+vehicleType+"','1') ;"
                    print("*********",insert_query)
                    staticVar.cursor.execute(insert_query)
                    staticVar.connection.commit()
                    result = {"registrationMsg": "Vehicle registered successfully"}
                    status="success"
                    status_who=statuswho.INSERTION_CARREGNO_SUCCESS
                    return retcommon_status.createJSONResponse(status,status_who,result)
                else:
                    result = {"registrationMsg": "Vehicle already exists in your profile."}
                    status="error"
                    status_who=statuswho.INSERTION_CARREGNO_FAIL
                    return retcommon_status.createJSONResponse(status,status_who,result)
        else:
            select_query = "SELECT vehicletype FROM tbl_vehicles INNER JOIN tbl_user ON tbl_vehicles.uid=tbl_user.uid WHERE email='"+email+"' AND carregistrationno='"+carregistrationno+"' AND vehicletype='temporary';"
            print("*********",select_query)
            staticVar.cursor.execute(select_query)
            staticVar.cursor.fetchall()
            counttemp = staticVar.cursor.rowcount
            if (counttemp == 0):
                print (str(counttemp)+" is null")
                insert_query = "INSERT INTO "+tablevehicle+"(uid,carregistrationno,vehicleType,currentactive) VALUES((SELECT uid FROM "+tableusers+" WHERE email='"+email+"'),'"+carregistrationno+"','"+vehicleType+"','1') ;"
                print("*********",insert_query)
                staticVar.cursor.execute(insert_query)
                staticVar.connection.commit()
                count = staticVar.cursor.rowcount
                #result = "New Vehicle Registration Number "+carregistrationno+" added successfully."
                result = {"registrationMsg": "Vehicle registered successfully"}
                status="success"
                status_who=statuswho.INSERTION_CARREGNO_SUCCESS
                return retcommon_status.createJSONResponse(status,status_who,result)
            else:
                result = {"registrationMsg": "Vehicle already exists in your profile."}
                status="error"
                status_who=statuswho.INSERTION_CARREGNO_FAIL
                return retcommon_status.createJSONResponse(status,status_who,result)
    except (Exception, psycopg2.DatabaseError) as error :
            status="error"
            status_who=statuswho.DATABASE_ERROR
            return retcommon_status.createJSONResponse(status,status_who,str(result))
    
    finally:
        closeConnection()



def closeConnection():
    result=-1
    status="default"
    status_who=""
    try:
        if(staticVar.DBConnectionData["isDBConnected"]):
            staticVar.cursor.close()
            staticVar.connection.close()
            staticVar.DBConnectionData["isDBConnected"] = False
            status="success"
            status_who=statuswho.DB_CLOSE_CONNECTION_SUCCESS
            return retcommon_status.createJSONResponse(status,status_who,str(result))
    except (Exception, psycopg2.Error) as error :
        status="error"
        status_who=statuswho.DB_CLOSE_CONNECTION_FAILURE
        return retcommon_status.createJSONResponse(status,status_who,str(result))


def checkOwner(tablevehicle,tableusers,carregistrationno):
    result=-1
    status="default"
    status_who=""
    checktype=""
    count=0
    counttemp=0
    countown=0
    try:
        if (isTableExist(tablevehicle)==False):
            status="error"
            status_who=statuswho.TABLE_DOESNOT_EXIST
            return retcommon_status.createJSONResponse(status,status_who,str(result))

        select_query = "SELECT vehicletype FROM "+tablevehicle+" WHERE carregistrationno='"+carregistrationno+"' AND vehicletype='owner';"
        print("*********",select_query)
        staticVar.cursor.execute(select_query)
        staticVar.cursor.fetchall()
        count = staticVar.cursor.rowcount
        if not(count == 0):
            #if (vehicleType == 'owner'):
            select1_query = "SELECT email FROM "+tableusers+" INNER JOIN "+ tablevehicle+" ON "+tableusers+".uid="+tablevehicle+".uid WHERE carregistrationno='"+carregistrationno+"' AND vehicletype='owner';"
            staticVar.cursor.execute(select1_query)
            staticVar.connection.commit()
            uservehicleData = staticVar.cursor.fetchall()
            results = {}
            email=""
            for row in uservehicleData:
                email = str(row[0])
                results= {"ownerEmail": email}
            staticVar.connection.commit()
            status="success"
            status_who=statuswho.CHECK_OWNER_SUCCESS
            return retcommon_status.createJSONResponse(status,status_who,results)
        else:
            result = {"Msg": "Owner doesnot exists for this vehicle registration number."}
            status="error"
            status_who=statuswho.CHECK_OWNER_FAILURE
            return retcommon_status.createJSONResponse(status,status_who,result)
    except (Exception, psycopg2.DatabaseError) as error :
        status="error"
        status_who=statuswho.DATABASE_ERROR
        return retcommon_status.createJSONResponse(status,status_who,str(result))
    
    finally:
        closeConnection()

