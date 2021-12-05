from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, validators
from wtforms.validators import DataRequired


class UsersForm(FlaskForm):
    email_address = StringField('Email Address', validators=[]
    )
    first_name = StringField('First Name', validators=[
            DataRequired(),
            validators.Length(min=2, message='First name should be at least %(min)d characters long'),
            validators.Length(max=32, message='First name should be no more than %(max)d characters long')
        ]
    )
    last_name = StringField('Last Name', validators=[
            DataRequired(),
            validators.Length(min=2, message='Last name should be at least %(min)d characters long'),
            validators.Length(max=32, message='Last name should be no more than %(max)d characters long')
        ]
    )
    current_password = PasswordField('Current Password', validators=[
            DataRequired()
        ]
    )
    new_password = PasswordField('New Password', validators=[
            DataRequired(),
            validators.Length(min=8, message='Password should be at least %(min)d characters long'),
            validators.Length(max=32, message='Password should be no more than %(max)d characters long'),
            validators.Regexp("^(?=.*[a-z])", message="Password must have a lowercase character"),
            validators.Regexp("^(?=.*[A-Z])", message="Password must have an uppercase character"),
            validators.Regexp("^(?=.*\\d)", message="Password must contain a number"),
            validators.Regexp("(?=.*[@$!%*#?&])", message="Password must contain a special character")
        ]
    )
    repeat_new_password = PasswordField('Repeat New Password', validators=[
            # DataRequired(),
            validators.EqualTo('password', message='Passwords must match')
        ]
    )
    gender = StringField('Gender', validators=[])
    age = IntegerField('Age', validators=[
            validators.Length(1,3, message='Invalid Age'),
            validators.Regexp("[0-9]", message="Only numbers please.")
        ]
    )
    zipcode = IntegerField('Zipcode', validators=[
            validators.Length(5, message='Invalid Zip Code'),
            validators.Regexp("[0-9]", message="Only numbers please.")
        ]
    )
    submit = SubmitField('Enter')

class SignupForm(FlaskForm):
    email_address = StringField('Email Address', validators=[
            DataRequired(),
            validators.Email()
        ]
    )
    first_name = StringField('First Name', validators=[
            DataRequired(),
            validators.Length(min=2, message='First name should be at least %(min)d characters long'),
            validators.Length(max=32, message='First name should be no more than %(max)d characters long')
        ]
    )
    last_name = StringField('Last Name', validators=[
            DataRequired(),
            validators.Length(min=2, message='Last name should be at least %(min)d characters long'),
            validators.Length(max=32, message='Last name should be no more than %(max)d characters long')
        ]
    )
    password = PasswordField('Password', validators=[
            DataRequired(),
            validators.Length(min=8, message='Password should be at least %(min)d characters long'),
            validators.Length(max=32, message='Password should be no more than %(max)d characters long'),
            validators.Regexp("^(?=.*[a-z])", message="Password must have a lowercase character"),
            validators.Regexp("^(?=.*[A-Z])", message="Password must have an uppercase character"),
            validators.Regexp("^(?=.*\\d)", message="Password must contain a number"),
            validators.Regexp("(?=.*[@$!%*#?&])", message="Password must contain a special character")
        ]
    )

class LoginForm(FlaskForm):
    email_address = StringField('Email Address', validators=[
            DataRequired(),
            validators.Email()
        ]
    )
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Enter')
