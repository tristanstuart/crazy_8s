from flask import Flask, send_from_directory
from flask_cors import CORS

#from flask_socketio import SocketIO, emit #needed much later
app = Flask(__name__,static_url_path="",static_folder="frontend/build")

#socketio = SocketIO(app);
#needed so flask and react dont conflict, comment out later
#CORS(app)

@app.route('/',defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

if __name__=='__main__':
    app.run(debug=True)