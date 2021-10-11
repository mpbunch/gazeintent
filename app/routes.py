from flask import request
import joblib
from flask import Flask, render_template
app=Flask(__name__)

@app.route("/")
def index():

    return render_template("index.html")

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
