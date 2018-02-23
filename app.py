import json
from pymongo import MongoClient
from flask import Flask, request, render_template, make_response
from form import TestForm
from bson.json_util import dumps

app = Flask(__name__)
app.config['SECRET_KEY'] = "my precious"


@app.route("/lab", methods=["GET", "POST"])
def index():
    """
    Render form and handle form submission
    """
    form = TestForm(request.form)
    form.lab.choices = [('', 'Select a Lab')] + [
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
    lab_id = int(request.args.get('lab_id'))
    db = request.args.get('db')
    print 'in /lab/db'
    client = MongoClient('localhost',lab_id)
    print client
    
    dbase = client[db]
    print dbase
    if "JSON" in dbase.collection_names():
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
        db_data[0] = "Collection Not Found" 
    return dumps(db_data[0])

@app.route("/lab/run", methods=["GET"])
def run_request():
    """
    Handles GET request to churn run

    """
    lab = request.args.get('lab')
    db = request.args.get('db')
    print 'in /lab/run'
    print lab
    print db
    return render_template('run.html')

def parse_json(json_file):
    with open(json_file) as data_file:    
        data = json.load(data_file)
    print data
    return data


if __name__ == "__main__":
    app.run(debug=True)
