import joblib
from flask import Flask, render_template, request, redirect, url_for
from flask_login import current_user, LoginManager, logout_user, login_required, login_user
from models import db, User
from forms import UsersForm, LoginForm
import json
import os

app=Flask(__name__)
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
    raise Exception('Credentials not found.')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL').replace('postgres://','postgresql://')
app.secret_key = secret_key
login_manager = LoginManager()
login_manager.init_app(app)
db.init_app(app)

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
    return 'Unauthorized'

@app.route('/client')
@app.route('/admin')
@login_required
def admin():
    if current_user.role == 'admin':
        active="admin"
        return render_template("admin.html", user=current_user, active=active)
    active="client"
    return render_template("client.html", user=current_user, active=active)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route("/")
def index():
    active="index"
    return render_template("index.html", active=active)

@app.route("/profile")
@login_required
def profile():
    active="profile"
    return render_template("profile.html", active=active)

@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    message={
        "message":False,
        "type":0
    }
    if request.method == 'POST':
        email_address = request.form['email_address']
        user = User().query.filter_by(email_address=email_address).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for('admin'))
        else:
            message={
                "message":"Invalid credentials, try again.",
                "type":2
            }
    active="login"
    return render_template("login.html", form=form, message=message, active=active)

@app.route("/documentation")
def documentation():
    active="documentation"
    return render_template("documentation.html", active=active)

# @app.route("/register", methods=['GET', 'POST'])
# @app.route('/signup', methods=['GET', 'POST'])
# def signup():
#     if request.method == 'POST':
#         # do stuff when the form is submitted

#         # redirect to end the POST handling
#         # the redirect can be to the same route or somewhere else
#         return redirect(url_for('index'))

#     # show the form, it wasn't submitted
#     return render_template('signup.html')

@app.route('/signup', methods=['GET', 'POST']) 
def signup(): 
    form = UsersForm()
    message={
        "message":False,
        "type":0
    }
    
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
                "message":"Successfuly created account.",
                "type":1
            }
        except:
            message = {
                "message": "Opps, something went wrong. Try again.",
                "type":2
            }
    active="signup"
    return render_template('signup.html', form=form, message=message, active=active)

@app.route('/slack', methods=['post'])
def slack():
    data = request.get_json()
    if not data:
        return
    email = data['user']['email']
    status = data['status']
    action = data['action']
    data = {"text": f"{email} {action} gazeintent. Status: {status}"}
    slack_webhook_url = os.environ.get('SLACK_WEBHOOK_URL')
    request.post(slack_webhook_url, data=data, headers={'Content-Type': 'application/json'})
    

if __name__ == "__main__":
    app.run(debug=True)
