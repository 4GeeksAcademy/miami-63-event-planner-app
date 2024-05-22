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

@app.route('api/favorites/<int:user_id>' , methods=['GET'])
@jwt_required()
def get_favorites(user_id):
    if get_jwt_identity() !=user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
        favorites = Favorites.query.filter_by(user_id=user_id).all()
    return jsonify([favorite.serialize() for favorite in favorites])

@app.route('/api/favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    favorite = Favorites.query.get_or_404(id)
    if get_jwt_identity() != favorite.user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    db.session.delete(favorite)
    db.session.commit()
    return '', 204

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        if not user.is_active:
            return jsonify({"msg": "Account is inactive. Please contact support."}), 403
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)