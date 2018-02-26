import json
import logging
from pexpect import pxssh
from pymongo import MongoClient
from flask import Flask, request, render_template, make_response, redirect, url_for
from form import TestForm
from bson.json_util import dumps

logger = logging.getLogger ('logging')

app = Flask(__name__)
app.config['SECRET_KEY'] = "my precious"


@app.route("/lab", methods=["GET", "POST"])
def index():
    """
    Render form and handle form submission
    """
    form = TestForm(request.form)
    form.lab.choices = [('0', 'Select a Lab')] + [
        (x['lab_id'], x['name']) for x in parse_json("labs.json")["labs"]]
    chosen_lab = None
    chosen_db = None
    
    return render_template('index.html', form=form)


@app.route("/lab/<int:lab_id>/", methods=["GET"])
def get_request(lab_id):
    """
    Handle GET request to - /<lab_id>/
    Return a list of DB
    
    """
    print 'in /lab/lab_id'
    c = MongoClient('localhost',lab_id)
    print c
    data= c.database_names()
    print data
    return json.dumps(data)
    
@app.route("/lab/db", methods=["GET"])
def db_request():
    """
    Handle GET request to - /<lab_id>/
    Return a list of DB
    
    """
    db_data = list();
    lab_id = int(request.args.get('lab_id'))
    db = request.args.get('db')
    print 'in /lab/db'
    client = MongoClient('localhost',lab_id)
    print client
    
    dbase = client[db]
    print dbase
    if 'JSON' in dbase.collection_names():
        collection = dbase.JSON
        print collection
        cursor = collection.find({})
        db_data = list(collection.find({}))
        print db_data[0]
        print 'Documents data #############################'
        print db_data
        #print cursor
        #for document in cursor:
        #    db_data.append(document)
    else:
        db_data.append("Collection JSON doesnot exist in this DataBase to show. If you want to go a head click Run CHURN") 
    return dumps(db_data[0])

@app.route("/lab/run", methods=["GET"])
def run_request():
    """
    Handles GET request to churn run

    """
    host = request.args.get('lab')
    db = request.args.get('db')
    print 'in /lab/run'
    print host
    print db
    #get labname for the host selected from drop down
    lab = hosttolab(host)
    print 'lab name in run_req method'
    print lab
    #Handle Run Commands here.
    churn_ssh(host, db, lab)

    return redirect(url_for('run', db_name=db))

@app.route("/run/<db_name>", methods=["GET", "POST"])
def run(db_name):
    return render_template('run.html')

def parse_json(json_file):
    with open(json_file) as data_file:    
        data = json.load(data_file)
    print data
    return data

def hosttolab(host):
    labname = ''
    data = parse_json("labs.json")["labs"]
    print data
    for x in data:
        if x['name'] == host:
            labname = x['lab']
    #if labname
    print 'lab name in host to lab method'
    print labname 
    return labname

def churn_ssh(host, db, lab):
    
    s = pxssh.pxssh()
    if not s.login (host , 'ec2-user', ''):
        #print "SSH session failed on login."
        logger.info("SSH session failed on login.")
        print str(s)
    else:
        #print "SSH session login successful"
        logger.info('SSH session login successful')
        s.sendline ('ls -l')
        s.prompt()         # match the prompt
        print s.before     # print everything before the prompt.
        s.sendline ('cd churn/src/')
        #s.sendline ('ls -l')
        #s.prompt()
        #print s.before
        s.sendline('pwd')
        s.prompt()
        print s.before
        #s.sendline ('./churn.py --lab ' +lab+ ' --db-name '+db)
        s.prompt()
        print s.before
        s.logout()



if __name__ == "__main__":
    app.run(debug=True)
