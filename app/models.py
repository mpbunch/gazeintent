from flask_sqlalchemy import SQLAlchemy 
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy() 

class User(db.Model, UserMixin):
    __tablename__ = 'auth_user'
    user_id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    id = user_id
    email_address = db.Column(db.String(145), primary_key=True, nullable=False)
    first_name = db.Column(db.String(145), nullable=False)
    last_name = db.Column(db.String(145), nullable=False)
    password = db.Column(db.String(145), nullable=False)
    role = db.Column(db.String(20), nullable=True, default='client')
    
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
