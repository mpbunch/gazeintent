from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, validators
from wtforms.validators import DataRequired
from wtforms_validators import Alpha, Integer


class ProfileForm(FlaskForm):
    """
    Profile form
    /profile
    """
    first_name = StringField('First Name', validators=[
            DataRequired(),
            validators.Length(min=2, message='First name should be at least %(min)d characters long'),
            validators.Length(max=32, message='First name should be no more than %(max)d characters long'),
            Alpha(message="Invalid character")
        ]
    )
    last_name = StringField('Last Name', validators=[
            DataRequired(),
            validators.Length(min=2, message='Last name should be at least %(min)d characters long'),
            validators.Length(max=32, message='Last name should be no more than %(max)d characters long')
        ]
    )
    gender = StringField('Gender', validators=[validators.Optional()])
    age = IntegerField('Age', validators=[
            validators.Optional(strip_whitespace=True),
            validators.NumberRange(min=18, max=120, message='Invalid age.')
        ]
    )
    zipcode = IntegerField('Zipcode', validators=[
            validators.Optional(strip_whitespace=True),
            validators.NumberRange(min=10000, max=99999, message='Invalid zip code.')
        ]
    )

class PasswordResetForm(FlaskForm):
    """
    Profile Change Password
    /profile
    """
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
            DataRequired(),
            validators.EqualTo('new_password', message='Passwords must match'),
        ]
    )

class SignupForm(FlaskForm):
    """
    Registration
    /signup
    """
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
    """
    Login Form
    /login
    """
    email_address = StringField('Email Address', validators=[
            DataRequired(),
            validators.Email()
        ]
    )
    password = PasswordField('Password', validators=[DataRequired()])
