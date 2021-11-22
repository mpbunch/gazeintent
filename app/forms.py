from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, validators
from wtforms.validators import DataRequired


class UsersForm(FlaskForm):
    email_address = StringField('Email Address',[DataRequired()])
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    current_password = PasswordField('Current Password', validators=[DataRequired()])
    new_password = PasswordField('New Password', validators=[DataRequired()])
    repeat_new_password = PasswordField('Repeat New Password', validators=[DataRequired()])
    gender = StringField('Gender', validators=[])
    age = IntegerField('Age', validators=[])
    zipcode = IntegerField('Zipcode', validators=[])
    submit = SubmitField('Enter')

class LoginForm(FlaskForm):
    email_address = StringField('Email Address', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Enter')
