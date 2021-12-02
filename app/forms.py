from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, validators
from wtforms.validators import DataRequired


class UsersForm(FlaskForm):
    email_address = StringField('Email Address',[DataRequired()])
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    current_password = PasswordField('Current Password', validators=[DataRequired()])
    new_password = PasswordField('New Password', validators=[        
        DataRequired(),
        validators.Length(min=8, message='Password should be at least %(min)d characters long'),
        validators.Length(max=32, message='Password should be no more than %(max)d characters long'),
        validators.Regexp("^(?=.*[a-z])", message="Password must have a lowercase character"),
        validators.Regexp("^(?=.*[A-Z])", message="Password must have an uppercase character"),
        validators.Regexp("^(?=.*\\d)", message="Password must contain a number"),
        validators.Regexp("(?=.*[@$!%*#?&])", message="Password must contain a special character"),
        ]
    )
    repeat_new_password = PasswordField('Repeat New Password', validators=[DataRequired(), validators.EqualTo('password', message='Passwords must match')])
    gender = StringField('Gender', validators=[])
    age = IntegerField('Age', validators=[])
    zipcode = IntegerField('Zipcode', validators=[])
    submit = SubmitField('Enter')

class SignupForm(FlaskForm):
    email_address = StringField('Email Address',[DataRequired()])
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[
        DataRequired(),
        validators.Length(min=8, message='Password should be at least %(min)d characters long'),
        validators.Length(max=32, message='Password should be no more than %(max)d characters long'),
        validators.Regexp("^(?=.*[a-z])", message="Password must have a lowercase character"),
        validators.Regexp("^(?=.*[A-Z])", message="Password must have an uppercase character"),
        validators.Regexp("^(?=.*\\d)", message="Password must contain a number"),
        validators.Regexp("(?=.*[@$!%*#?&])", message="Password must contain a special character"),
        ]
    )

class LoginForm(FlaskForm):
    email_address = StringField('Email Address', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Enter')
