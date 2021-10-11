from flask_sqlalchemy import SQLAlchemy 
db = SQLAlchemy() 

class User(db.Model):
    __tablename__ = 'auth_user'
    email_address = db.Column(db.String(145), primary_key=True, nullable=False)
    first_name = db.Column(db.String(145), nullable=False)
    last_name = db.Column(db.String(145), nullable=False)
    password = db.Column(db.String(145), nullable=False)
