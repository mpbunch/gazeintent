from flask import request
import joblib
from flask import Flask, render_template
from models import db, User
from forms import UsersForm
app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/usersdb' 
db.init_app(app)
app.secret_key = "e14a-key" 

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/documentation")
def documentation():
    return render_template("documentation.html")

@app.route("/register", methods=['GET', 'POST'])
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # do stuff when the form is submitted

        # redirect to end the POST handling
        # the redirect can be to the same route or somewhere else
        return redirect(url_for('index'))

    # show the form, it wasn't submitted
    return render_template('signup.html')

if __name__ == "__main__":
    app.run(debug=True)
