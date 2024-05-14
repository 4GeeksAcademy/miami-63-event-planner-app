from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import date

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Change to your database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    dob = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "dob": self.dob.isoformat(),
            # Do not serialize the password, it's a security breach
        }
    
class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location_id'))
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    date_of_event = db.Column(db.Date, nullable=False)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date_of_event = db.Column(db.Date, nullable=False)
    street = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Event {self.name} on {self.date_of_event}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date_of_event": self.date_of_event.isoformat(),  # Serialize date as ISO format string
            "user_id": self.user_id,
            "street": self.street,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "country": self.country
        }
    

    def __repr__(self):
        return f'<Event {self.name} on {self.date_of_event}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date_of_event": self.date_of_event.isoformat(),  # Serialize date as ISO format string
            "user_id": self.user_id
        }

# Ensure that you create the tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
