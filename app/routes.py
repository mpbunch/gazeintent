from flask import Flask, render_template, request, redirect, url_for
from flask_login import current_user, LoginManager, logout_user, login_required, login_user
from models import db, User, Calibration
from forms import LoginForm, SignupForm, ProfileForm, PasswordResetForm
from werkzeug.security import generate_password_hash, check_password_hash
import json
import requests
import os
from sqlalchemy import exc


app = Flask(__name__)
# In order to keep the database credentials, and secret_key secure
# We need to use environment variables
# Heroku does this natively
#
# Your localhost does not
# Before you start the application on your local machine
# run the following code:
#
# export DATABASE_URL=$(heroku config:get DATABASE_URL -a gazeintent)
# export SECRET_KEY=$(heroku config:get SECRET_KEY -a gazeintent)
#
# check to see that $DATABASE_URL looks correct
# echo $DATABASE_URL
# postgres://[user-name-random-characters]:[password-random-characters]@[ec2-path.*.amazonaws.com]:[port]/[database-name]

db_url = os.environ.get('DATABASE_URL')
secret_key = os.environ.get('SECRET_KEY')

if not db_url or not secret_key:
    # Fail if no environment variable is found.
    raise Exception('Credentials not found. Did you for get to export environment variables?')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL').replace('postgres://', 'postgresql://')
app.config['SECRET_KEY'] = secret_key
login_manager = LoginManager()
login_manager.init_app(app)
db.init_app(app)


"""
Home
"""
@app.route("/")
def index():
    return render_template("site/index.html")

"""
Documentation
"""
@app.route("/documentation")
def documentation():
    # Sets active state of navigation item
    active = "documentation"
    return render_template("site/documentation.html", active=active)

"""
Signup
"""
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    # Default message
    message = {
        "message": False,
        "type": 0
    }
    # Signup form
    form = SignupForm(request.form)
    # If POST
    if request.method == 'POST':
        # If Valid form submission
        if form.validate_on_submit():
            email_address = request.form['email_address']
            first_name = request.form['first_name']
            last_name = request.form['last_name']
            new_user = User(first_name=first_name, last_name=last_name, email_address=email_address)
            # hash the password
            new_user.set_password(request.form['password'])
            try:
                db.session.add(new_user)
                db.session.commit()
                # If no exception, success message
                message = {
                    "message": "Successfuly created account.",
                    "type": 1
                }
            # Database Error
            except exc.SQLAlchemyError as e:
                # According to SQLAlchemy 1.3 Documentation: 
                # https://docs.sqlalchemy.org/en/13/faq/sessions.html#this-session-s-transaction-has-been-rolled-back-due-to-a-previous-exception-during-flush-or-similar
                db.session.rollback()
                message = {
                    "message": "Opps, something went wrong. Try again.",
                    "type": 2
                }
        # If invalid form submission
        else:
            # Error message
            message = {
                "message": "Oops something isn't quite right.",
                "type": 2
            }
    active = 'signup'
    return render_template('site/signup.html', form=form, message=message, active=active)

"""
Login / Logout
"""
@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)
    message = {
        "message": False,
        "type": 0
    }
    if request.method == 'POST':
        if form.validate_on_submit():
            email_address = request.form['email_address']
            user = User().query.filter_by(email_address=email_address).first()
            if user and user.check_password(form.password.data):
                login_user(user)
                return redirect(url_for('admin'))
            else:
                message = {
                    "message": "Invalid credentials, try again.",
                    "type": 2
                }
        else:
            message = {
                "message": "Oops, something isn't quite right.",
                "type": 2
            }
    active = "login"
    return render_template("site/login.html", form=form, message=message, active=active)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

"""
Authenticated
    Client Calibration
    Client Test
    Client History
    Client Profile
        Update Information
        Change Password
    Dashboard
        Client
        Admin
"""
# Client Calibration
@app.route("/calibrate")
@login_required
def clientcalibrate():
    return render_template("client/calibrate.html")

# Client Test
@app.route("/test")
@login_required
def clienttest():
    return render_template("client/test.html")

# Client History
@app.route("/clienthistory")
@login_required
def clienthistory():
    user_id = current_user.get_id()
    data = Calibration.query.all()
    print(user_id)
    calibration_data, test_data = formatData(data, user_id)
    return render_template("client/history.html", details=calibration_data, tdetails=test_data)

# Client Profile | Update Information
@app.route("/profile", methods=['GET', 'POST'])
@login_required
def profile():
    form = ProfileForm(request.form)
    message = {
        "message": False,
        "type": 0
    }
    if request.method == "POST":
        if form.validate_on_submit():
            try:
                current_user.first_name = form.first_name.data
                current_user.last_name = form.last_name.data
                current_user.age = form.age.data
                current_user.gender = form.gender.data
                current_user.zipcode = form.zipcode.data
                db.session.commit()
                message = {
                    "message": "Successfuly updated profile.",
                    "type": 1
                }
            except exc.SQLAlchemyError as e:
                # According to SQLAlchemy 1.3 Documentation:
                # https://docs.sqlalchemy.org/en/13/faq/sessions.html#this-session-s-transaction-has-been-rolled-back-due-to-a-previous-exception-during-flush-or-similar
                db.session.rollback()
                message = {
                    "message": "Oops, something went wrong.",
                    "type": 2
                }
        else:
            message = {
                "message": "Oops, something went wrong.",
                "type": 2
            }
    active = 'profile'
    return render_template("client/profile.html", form=form, message=message, user=current_user, active=active)

# Client Profile | Change Password
@app.route("/resetpassword", methods=['GET', 'POST'])
@login_required
def resetpassword():
    form = PasswordResetForm(request.form)
    message = {
        "message": False,
        "type": 0
    }
    if request.method == "POST":
        if form.validate_on_submit():
            # if current password is correct
            if current_user.check_password(form.current_password.data):
                try:
                    new_password = request.form['new_password']
                    # Hash the new password
                    current_user.password = generate_password_hash(new_password)
                    db.session.commit()
                    message = {
                        "message": "Password has been updated.",
                        "type": 1
                    }
                except exc.SQLAlchemyError as e:
                    # According to SQLAlchemy 1.3 Documentation:
                    # https://docs.sqlalchemy.org/en/13/faq/sessions.html#this-session-s-transaction-has-been-rolled-back-due-to-a-previous-exception-during-flush-or-similar
                    db.session.rollback()
                    message = {
                        "message": "Oops, something went wrong.",
                        "type": 2
                    }
            # if current password is incorrect
            else:
                message = {
                    "message": "Current password is wrong.",
                    "type": 2
                }
        else:
            message = {
                "message": "Oops, something went wrong.",
                "type": 2
            }
    return render_template("client/resetpassword.html", form=form, message=message, user=current_user)

# Client & Admin Dashboard
@app.route('/client')
@app.route('/admin')
@login_required
def admin():
    if current_user.role == 'admin':
        # data for profile list
        profile = User.query.all()

        # data for Calibration list
        query = Calibration.query
        data = query.all()
        totalType = Calibration.query.with_entities(Calibration.data).count()

        data = Calibration.query.all()
        calibration_data, test_data = formatData(data)
        active = 'admin'
        return render_template("admin/admin.html", user=current_user, calibration=data, details=calibration_data, tdetails=test_data, profile=profile, totalType=totalType, active=active)
    active = 'client'
    return render_template("client/client.html", user=current_user, active=active)

"""
Support Misc
    Slack support for heroku webhook integration
    Javascript API
    404
    User Loader
    Request Handler
    Unauthorized
"""
# Slack
@app.route('/slack', methods=['post'])
def slack():
    data = request.get_json()
    if not data:
        return "Missing payload."
    try:
        status = data['data']['status']
        action = data['action']
        data = {"text": '{action} gazeintent. Status: {status}'.format(action=action, status=status)}
        slack_webhook_url = os.environ.get('SLACK_WEBHOOK_URL')
    except Exception:
        return "Malformed payload."

    try:
        if action.lower() == 'update':
            response = requests.post(slack_webhook_url, data=json.dumps(data), headers={'Content-Type': 'application/json'})
    except Exception:
        return "Some error with posting to slack."
    return "Message sent to slack."

# API
@app.route('/api/calibrate', methods=['POST', 'GET'])
def api_calibrate():
    if request.method == 'POST':
        # We can now take the payload and insert it into the db
        payload = request.json
        user_id = current_user.get_id()
        try:
            new_calibration = Calibration(user_id=user_id, data=payload)
            db.session.add(new_calibration)
            db.session.commit()
            message = {
                "message": "Calibration Complete.",
                "type": 1
            }
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            message = {
                "message": "Opps, something went wrong. Try again.",
                "type": 2
            }
        return message
    return render_template('shared/404.html'), 404

# 404 Route
@app.errorhandler(404)
def page_not_found(e):
    return render_template('shared/404.html'), 404

# Get user information
@login_manager.user_loader
def user_loader(user_id):
    user = User().query.filter_by(user_id=user_id).first()
    if not user:
        return
    return user

# Request loader
@login_manager.request_loader
def request_loader(request):
    if request.form.get('email_address'):
        email_address = request.form.get('email_address')
        user = User().query.filter_by(email_address=email_address).first()
        if not user:
            return
        return user

# Unauthorized handler
@login_manager.unauthorized_handler
def unauthorized_handler():
    # Instead of showing unauthroized 
    # Display a 404
    # By showing unauthorized you are telling
    # potential attackers that the page exists and 
    # reqiures authentication (something of value exists here)
    return render_template('shared/404.html'), 404

def formatData(data, user_id=None):
    # hacky solution
    # i spent a ton of time messing the sql alchemy
    # and just decided to do it all in code
    calibration_data = []
    test_data = []
    for row in data:
        record = {}
        record_user_id = getattr(row, 'user_id')
        record_data = getattr(row, 'data')
        if not user_id or int(user_id) == int(record_user_id):
            for x in row.__table__.columns:
                value = getattr(row, x.name)
                if x.name == 'record_created':
                    value = value.strftime('%m/%d/%y')
                record[x.name] = value
            if 'data' not in record_data:
                calibration_data.append(record)
            else:
                test_data.append(record)
    return calibration_data, test_data


if __name__ == "__main__":
    app.run(debug=True)
