from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime
from models import db, User, Favorites 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this in production

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
CORS(app)

@app.route('api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        email=data['email'],
        is_active=data.get('is_active', True),
        dob=datetime.strptime(data['dob'], '%Y-%m-%d').date(),
        address=data.get('address')                      
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

@app.route('api/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    user = User.query.get_or_404(id)
    if get_jwt_identity() != user.id:
        return jsonify({"mes": "Unauthorized"}), 403
    
    data = request.get_json()
    user.email = data.get('email', user.email)
    user.is_active = data.get('is_active', user.is_active)
    user.dob = datetime.strptime(data['dob'], '%Y-%m-%d').date() if 'dob' in data else user.dob
    user.address = data.get('address', user.address)
    if 'password' in data:
        user.set_password(data['password'])

    db.session.commit()
    return jsonify(user.serialize()), 200

@app.route('/api/favorites' , methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()
    new_favorite = Favorites(
        user_id=get_jwt_identity(),
        event_id=data['event_id'],
        event_name=data['event_name'],
        event_image=data.get('event_image', ''),
        event_start=datetime.fromisoformat(data['event_start']),
        event_end=datetime.fromisoformat(data['event_end']) if data['event_end'] else None,
        street=data['street'],
        city=data['city'],
        state=data['state'],
        zip_code=data['zip_code'],
        country=data['country']
    )
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.serialize()), 201