from flask.ext.wtf import Form
from wtforms import SelectField


class TestForm(Form):
    lab = SelectField(u'', choices=())
    db = SelectField(u'', choices=())