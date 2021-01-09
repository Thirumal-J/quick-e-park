from flask import Flask, request, jsonify
import json
import retcommon_status

app = Flask(__name__)

DB_HOST="192.168.99.100"
DB_NAME="QuickEPark"
DB_USER="postgres"
DB_PASS="Pass@123"

@app.route('/',)
def index():
    return "Hello!! This is geolocation location api"

@app.route('/saveloc',methods=['POST'])
def saveloc():
 rf=request.form
 for key in rf.keys():
  data=key
 print(data)
 data_dic=json.loads(data)
 print(data_dic.keys())
 lat=data_dic['lat']
 lon=data_dic['lon']
 resp_dic={"lat":lat,"lon":lon}
 resp = jsonify(resp_dic)
 resp.headers['Access-Control-Allow-Origin']='*'
 return retcommon_status.createJSONResponse(status,status_who,str(result))




if(__name__=="__main__"):
    #app.run(host='192.168.0.7')
    app.run(port=5003, debug=True)