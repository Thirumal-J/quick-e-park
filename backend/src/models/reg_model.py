# Input File for providing DB details, table name, common string formats
import app_configuration as appConf
import retcommon_status
import statuswho
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import sys
sys.path.append(os.getcwd())


class staticVar:
    connection = ""
    cursor = ""
    DBConnectionData = {"statusCode": None,
                        "connectionMsg": None, "isDBConnected": False}
    DBQueryStatus = {"statusCode": None,
                     "queryResult": None, "statusMessage": None}


def getDbConnection():
    result = -1
    status = "default"
    status_who = ""
    try:
        # DB Details fetched from the Configuration file
        staticVar.connection = psycopg2.connect(user=appConf.registrationDBConfig["user"],
                                                password=appConf.registrationDBConfig["password"],
                                                host=appConf.registrationDBConfig["host"],
                                                port=appConf.registrationDBConfig["port"],
                                                database=appConf.registrationDBConfig["database"])
        staticVar.cursor = staticVar.connection.cursor()
        status = "success"
        status_who = statuswho.DB_CONNECTION_SUCCESS
        return retcommon_status.createJSONResponse(status, status_who, str(result))
    except (Exception, psycopg2.Error) as error:
        status = "error"
        status_who = statuswho.DB_CONNECTION_FAILED
        return retcommon_status.createJSONResponse(status, status_who, str(result))


def isTableExist(tableName):
    result = -1
    status = "default"
    status_who = ""
    try:
        getDbConnection()
        table_exist_query = "SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_name ='"+tableName+"');"
        staticVar.cursor.execute(table_exist_query)  # Should be logged
        if (staticVar.cursor.fetchone()[0]):
            status = "success"
            status_who = statuswho.TABLE_EXIST
            return True
        else:
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
            return False
    except (Exception, psycopg2.DatabaseError) as error:
        status = "error"
        status_who = statuswho.DATABASE_ERROR
        return retcommon_status.createJSONResponse(status, status_who, str(result))


def dropTable(tableName):
    result = -1
    status = "default"
    status_who = ""
    try:
        if (isTableExist(tableName)):
            staticVar.cursor.execute("DROP TABLE "+tableName+" CASCADE;")
            staticVar.connection.commit()
            status = "success"
            status_who = statuswho.DROP_TABLE_SUCCESS
            return retcommon_status.createJSONResponse(status, status_who, str(result))
        else:
            status = "error"
            status_who = statuswho.DROP_TABLE_FAILURE
            return retcommon_status.createJSONResponse(status, status_who, str(result))

    except (Exception, psycopg2.DatabaseError) as error:
        status = "error"
        status_who = statuswho.DATABASE_ERROR
        return retcommon_status.createJSONResponse(status, status_who, str(result))

    finally:
        closeConnection()


def createRegistrationTable():
    result = -1
    status = "default"
    status_who = ""
    try:
        if (isTableExist(appConf.registrationtableName)):
            status = "success"
            status_who = statuswho.TABLE_EXIST
            return retcommon_status.createJSONResponse(status, status_who, str(result))
        else:
            create_table_query = f'CREATE TABLE IF NOT EXISTS public."{appConf.registrationtableName}"(UID SERIAL PRIMARY KEY,Name varchar,Surname varchar,Email varchar UNIQUE NOT NULL,Password varchar,mobileno bigint,licenseno varchar UNIQUE NOT NULL,ActiveStatus bit,RegDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP);'
            alter_table_query = f'ALTER TABLE public."{appConf.registrationtableName}" OWNER to {appConf.registrationDBConfig["user"]};'
            staticVar.cursor.execute(create_table_query)
            staticVar.cursor.execute(create_table_query)
            staticVar.connection.commit()
            status = "success"
            status_who = statuswho.CREATE_TABLE_SUCCESS
            return retcommon_status.createJSONResponse(status, status_who, str(result))

    except (Exception, psycopg2.DatabaseError) as error:
        status = "error"
        status_who = statuswho.DATABASE_ERROR
        return retcommon_status.createJSONResponse(status, status_who, str(result))

    finally:
        closeConnection()


def insertDataIntoTable(tableName, name, surname, email, password, mobileno, licenseno):
    result = -1
    status = "default"
    status_who = ""
    try:
        createRegistrationTable()
        if (isTableExist(tableName) == False):
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
            return retcommon_status.createJSONResponse(status, status_who, str(result))

        insert_query = "INSERT INTO "+tableName+" (Name,Surname,Email,Password,mobileno,licenseno,activestatus) VALUES ('" + \
            name+"','"+surname+"', '"+email+"','"+password + \
            "','"+mobileno+"','"+licenseno+"','1' );"
        record_to_insert = (tableName, name, surname, email,
                            password, mobileno, licenseno)
        staticVar.cursor.execute(insert_query)
        staticVar.connection.commit()
        staticVar.cursor.rowcount
        status = "success"
        status_who = statuswho.REGISTRATION_STATUS
        return retcommon_status.createJSONResponse(status, status_who, str(result))

    except (Exception, psycopg2.DatabaseError) as error:
        status = "error"
        status_who = statuswho.REGISTRATION_STATUS_FAIL
        result = "EmailID ."
        return retcommon_status.createJSONResponse(status, status_who, str(result))

    finally:
        closeConnection()


def fetchDataFromTable(tableName):
    result = -1
    status = "default"
    status_who = ""
    try:
        createRegistrationTable()
        if (isTableExist(tableName) == False):
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
            return retcommon_status.createJSONResponse(status, status_who, str(result))

        staticVar.cursor = staticVar.connection.cursor(
            cursor_factory=RealDictCursor)
        fetch_query = "SELECT * FROM "+tableName+";"
        staticVar.cursor.execute(fetch_query)
        staticVar.connection.commit()
        results = staticVar.cursor.fetchall()
        userdata = {}
        count = 0
        for row in results:
            userdata[count] = row
            count = count + 1

        status = "success"
        status_who = statuswho.FETCH_ALL_SUCCESS
        result = result[0][0]
        return retcommon_status.createJSONResponse(status, status_who, str(result))
        return userdata

    except (Exception, psycopg2.DatabaseError) as error:
        status = "error"
        status_who = statuswho.FETCH_ALL_FAILURE
        result = "EmailID or License Number already exists."
        return retcommon_status.createJSONResponse(status, status_who, str(result))

    finally:
        closeConnection()


def closeConnection():
    result = -1
    status = "default"
    status_who = ""
    try:
        if (staticVar.DBConnectionData["isDBConnected"]):
            staticVar.cursor.close()
            staticVar.connection.close()
            staticVar.DBConnectionData["isDBConnected"] = False
            status = "success"
            status_who = statuswho.DB_CLOSE_CONNECTION_SUCCESS
            return retcommon_status.createJSONResponse(status, status_who, str(result))
    except (Exception, psycopg2.Error) as error:
        status = "error"
        status_who = statuswho.DB_CLOSE_CONNECTION_FAILURE
        return retcommon_status.createJSONResponse(status, status_who, str(result))


def updatePassword(tableName, email, password, updatepassword):
    result = -1
    status = "default"
    status_who = ""
    try:
        if (isTableExist(tableName) == False):
            status = "error"
            status_who = statuswho.TABLE_DOESNOT_EXIST
            return retcommon_status.createJSONResponse(status, status_who, str(result))

        select_query = "SELECT * FROM "+tableName + \
            " WHERE email='"+email+"' AND password='"+password+"';"
        staticVar.cursor.execute(select_query)
        staticVar.cursor.fetchall()
        count = staticVar.cursor.rowcount
        if not (count == 0):
            status = "success"
            staticVar.cursor.execute(" UPDATE "+tableName+" SET password ='" +
                                     updatepassword+"' WHERE email ='"+email+"'AND password='"+password+"';")
            staticVar.connection.commit()
            result = {"Msg": "Password updated successfully."}
            status_who = statuswho.UPDATE_TABLE_SUCCESS
            return retcommon_status.createJSONResponse(status, status_who, result)
        else:
            status = "error"
            status_who = statuswho.UPDATE_PASSWORD_FAILURE
            return retcommon_status.createJSONResponse(status, status_who, str(result))
    except (Exception, psycopg2.DatabaseError) as error:
        status = "error"
        status_who = statuswho.DATABASE_ERROR
        return retcommon_status.createJSONResponse(status, status_who, str(result))

    finally:
        closeConnection()
