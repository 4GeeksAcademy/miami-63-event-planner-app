from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import date, datetime
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')  # Load from environment
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')  # Load from environment

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(80), unique=False, nullable=False)
    dob = db.Column(db.Date, nullable=True)
    location = db.Column(db.String, nullable=False)
    lng = db.Column(db.Float, nullable=True)  
    lat = db.Column(db.Float, nullable=True)
    favorites = db.relationship('Favorites', backref=db.backref('user', lazy=True))
    
    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        self.hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.hashed_password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "dob": self.dob.isoformat() if self.dob else None,
            "location": self.location,
            "lng": self.lng,
            "lat": self.lat,
            # Do not serialize the password, it's a security breach
        }
    
    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()
    
class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String(100), nullable=False)
    startTime = db.Column(db.DateTime, nullable=False)
    endTime = db.Column(db.DateTime, nullable=True)
    description = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=False)
    imageURL = db.Column(db.String(255), nullable=True)
    
    def __repr__(self):
        return f'<Favorites user_id={self.user_id} id={self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "startTime": self.startTime.isoformat(),
            "endTime": self.endTime.isoformat() if self.endTime else None,
            "description": self.description,
            "location": self.location,
            "imageURL": self.imageURL 
        }

# Ensure that you create the tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
