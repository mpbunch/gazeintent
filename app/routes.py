from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import current_user, LoginManager, logout_user, login_required, login_user
from models import db, User, Calibration
from forms import UsersForm, LoginForm, SignupForm
from werkzeug.security import generate_password_hash, check_password_hash
import json
import requests
import os
from sqlalchemy.inspection import inspect


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
    raise Exception(
        'Credentials not found. Did you for get to export environment variables?')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL').replace('postgres://', 'postgresql://')
app.config['SECRET_KEY'] = secret_key
login_manager = LoginManager()
login_manager.init_app(app)
db.init_app(app)

# This will be the calibration api
@app.route('/api/calibrate', methods=['POST', 'GET'])
def api_calibrate():
    if request.method == 'POST':
        # We can now take the payload and insert it into the db
        # We will need to create the model
        # and do some testing, but we should be able to finish this tomorrow
        payload = request.json
        user_id = current_user.id
        print('--')
        print(current_user)
        new_calibration = Calibration(
            user_id=user_id, data=json.dumps(payload))
        try:
            db.session.add(new_calibration)
            db.session.commit()
            message = "Calibration Complete" if payload['id'] == 9 else "Calibration data saved."
            message = {
                "message": message,
                "type": 1
            }
        except Exception as e:
            print(e)
            db.session.rollback()
            message = {
                "message": "Opps, something went wrong. Try again.",
                "type": 2
            }
        return message
    active = "calibrate"
    return render_template("calibrate.html", active=active)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('shared/404.html'), 404


@login_manager.user_loader
def user_loader(user_id):
    user = User().query.filter_by(user_id=user_id).first()
    if not user:
        return
    return user


@login_manager.request_loader
def request_loader(request):
    if request.form.get('email_address'):
        email_address = request.form.get('email_address')
        user = User().query.filter_by(email_address=email_address).first()
        if not user:
            return
        return user


@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('index'))


@app.route('/client')
@app.route('/admin')
@login_required
def admin():
    if current_user.role == 'admin':
        active = "admin"


        # data for profile list
        profile = User.query.all()
        # data for Calibration list
        query = Calibration.query
        data = query.all()
        details = query.with_entities(
            Calibration.data).filter()[:2]
        details = [json.loads(x[0]) for x in details]
        # type_cal = Calibration.query.with_entities(
        #     Calibration.user_id).filter_by(type="calibration")
        # totalType = Calibration.query.filter(Calibration.user_id=="26").with_entities(
        #     Calibration.data)
        totalType = Calibration.query.with_entities(
            Calibration.data).count()

        data = Calibration.query.all()
        # This is to clean up the text as json issue
        # There should be a better solution to this problem
        # but too much time has been spent on this already
        new_data = []
        for row in data:
            record = {}
            for x in row.__table__.columns:
                value = getattr(row, x.name)
                if x.name == 'record_created':
                    value = value.strftime('%m/%d/%y')
                try:
                    record[x.name] = json.loads(value)
                except Exception:
                    record[x.name] = value
            new_data.append(record)
        details = new_data
        return render_template("admin/admin.html", user=current_user, active=active, calibration=data, details=details, profile=profile, totalType=totalType)
    active = "client"
    return render_template("client/client.html", user=current_user, active=active)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route("/")
def index():
    active = "index"
    return render_template("site/index.html", active=active)


@app.route("/profile", methods=['GET', 'POST'])
@login_required
def profile():
    form = UsersForm()
    message = {
        "message": False,
        "type": 0
    }

    if request.method == "POST":

        # Update bio section
        if request.form.get("bio") == "updatebio":
            current_user.first_name = form.first_name.data
            current_user.last_name = form.last_name.data
            current_user.email_address = form.email_address.data
            db.session.commit()
            message = {
                "message": "Successfuly updated bio.",
                "type": 1
            }

        # Update demo section
        elif request.form.get("demo") == "updatedemo":
            current_user.age = form.age.data
            current_user.gender = form.gender.data
            current_user.zipcode = form.zipcode.data
            db.session.commit()
            message = {
                "message": "Successfuly updated demo.",
                "type": 1
            }

        # Update password
        elif request.form.get("security") == "updatesecurity":
            new_password = request.form['new_password']
            repeat_new_password = request.form['repeat_new_password']

            # if current password is correct
            if current_user.check_password(form.current_password.data):
                # if passwords match
                if new_password == repeat_new_password:
                    # Hash the new password
                    current_user.password = generate_password_hash(
                        new_password)
                    db.session.commit()
                    message = {
                        "message": "Password has been updated.",
                        "type": 1
                    }
                # if passwords don't match
                else:
                    # remind to check
                    message = {
                        "message": "Please make sure your new passwords match.",
                        "type": 2
                    }
            # if current password is not correct
            else:
                message = {
                    "message": "Current password is wrong.",
                    "type": 2
                }

        else:
            form.first_name.data = current_user.first_name
            form.last_name.data = current_user.last_name
            form.email_address.data = current_user.email_address
            form.age.data = current_user.age
            form.gender.data = current_user.gender
            form.zipcode.data = current_user.zipcode
            print("Get profile information")

    active = "profile"
    return render_template("client/profile.html", form=form, message=message, user=current_user, active=active)


@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
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


@app.route("/documentation")
def documentation():
    active = "documentation"
    return render_template("documentation.html", active=active)


@app.route("/calibrate")
@login_required
def clientcalibrate():
    active = "calibrate"
    return render_template("client/calibrate.html", active=active)


@app.route("/test")
@login_required
def clienttest():
    active = "test"
    return render_template("client/test.html", active=active)


@app.route("/clienthistory")
@login_required
def clienthistory():
    active = "clienthistory"
    user_id = current_user.get_id()
    data = Calibration.query.with_entities(
        Calibration.data).filter_by(user_id=user_id).all()
    data = [json.loads(x[0]) for x in data]
    print(data)
    return render_template("client/history.html", active=active, history=data)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    message = {
        "message": False,
        "type": 0
    }
    form = SignupForm(request.form)
    print(form.validate_on_submit())
    if request.method == 'POST':
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
                message = {
                    "message": "Successfuly created account.",
                    "type": 1
                }
            except:
                # Not sure this is needed
                # As the only way this block will be hit is if the db.session fails
                # Which will result in no data entered to need a rollback
                # including rollback() in the exception statement. According to SQLAlchemy 1.3 Documentation: https://docs.sqlalchemy.org/en/13/faq/sessions.html#this-session-s-transaction-has-been-rolled-back-due-to-a-previous-exception-during-flush-or-similar
                db.session.rollback()
                message = {
                    "message": "Opps, something went wrong. Try again.",
                    "type": 2
                }
        else:
            message = {
                "message": "Oops something isn't quite right.",
                "type": 2
            }
    active = "signup"
    return render_template('site/signup.html', form=form, message=message, active=active)


@app.route('/slack', methods=['post'])
def slack():
    data = request.get_json()
    if not data:
        return "Missing payload."
    try:
        status = data['data']['status']
        action = data['action']
        data = {"text": '{action} gazeintent. Status: {status}'.format(
            action=action, status=status)}
        slack_webhook_url = os.environ.get('SLACK_WEBHOOK_URL')
    except Exception:
        return "Malformed payload."

    try:
        if action.lower() == 'update':
            response = requests.post(slack_webhook_url, data=json.dumps(
                data), headers={'Content-Type': 'application/json'})
            if response.status_code != 200:
                pass
                # raise ValueError(f'Request to slack returned an error {response.status_code}, the response is:\n{response.text}')
    except Exception:
        return "Some error with posting to slack."
    return "Message sent to slack."


if __name__ == "__main__":
    app.run(debug=True)