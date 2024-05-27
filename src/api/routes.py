"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Blueprint, request, jsonify
from api.models import db, User, Favorites
from api.utils import APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import os
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    location = data.get('location')
    lat = data.get('lat')
    lng = data.get('lng')
    
    if not email or not password or not location or lat is None or lng is None:
        return jsonify({"ok": False, "msg": "Missing email, password, location, latitude, or longitude"}), 400
    
    hashed_password = generate_password_hash(password)
    new_user = User(email=email, hashed_password=hashed_password, location=location, lat=lat, lng=lng)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"ok": True, "msg": "User added successfully"}), 201

@api.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"ok": False, "msg": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.hashed_password, password):
        return jsonify({"ok": False, "msg": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({"ok": True, "msg": "User authenticated successfully", "payload": {
        "access_token": access_token,
        "email": user.email,
        "location": user.location
    }}), 200

@api.route('/events', methods=['GET'])
@jwt_required()
def get_events():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"ok": False, "msg": "User not found"}), 404

    lat = user.lat
    lng = user.lng

    ticketmaster_url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        'apikey': os.getenv('TICKETMASTER_API'),
        'latlong': f"{lat},{lng}",
        'radius': 50,
        'unit': 'miles',
        'locale': '*',
    }

    response = requests.get(ticketmaster_url, params=params)
    if response.status_code != 200:
        return jsonify({"ok": False, "msg": "Error fetching events from Ticketmaster"}), response.status_code

    events_data = response.json()
    events = []

    for event in events_data.get('_embedded', {}).get('events', []):
        events.append({
            "title": event.get('name'),
            "startTime": event.get('dates', {}).get('start', {}).get('dateTime'),
            "endTime": event.get('dates', {}).get('end', {}).get('dateTime'),
            "description": event.get('info'),
            "location": event.get('_embedded', {}).get('venues', [])[0].get('name'),
            "imageURL": event.get('images', [])[0].get('url') if event.get('images') else None
        })

    return jsonify({"ok": True, "msg": "Events fetched successfully", "payload": events}), 200

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    return jsonify({"ok": True, "msg": "Favorites retrieved successfully", "payload": [favorite.serialize() for favorite in favorites]}), 200

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    title = data.get('title')
    start_time = data.get('startTime')
    end_time = data.get('endTime')
    location = data.get('location')
    
    if not title or not start_time or not location:
        return jsonify({"ok": False, "msg": "Missing title, start time, or location"}), 400
    
    new_favorite = Favorites(
        user_id=user_id,
        title=title,
        startTime=datetime.fromisoformat(start_time),
        endTime=datetime.fromisoformat(end_time) if end_time else None,
        location=location,
        description=data.get('description'),
        imageURL=data.get('imageURL')
    )
    db.session.add(new_favorite)
    db.session.commit()
    
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    return jsonify({"ok": True, "msg": "Favorite added successfully", "payload": [favorite.serialize() for favorite in favorites]}), 201

@api.route('/favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    user_id = get_jwt_identity()
    favorite = Favorites.query.filter_by(id=id, user_id=user_id).first()
    
    if not favorite:
        return jsonify({"ok": False, "msg": "Favorite not found"}), 404
    
    db.session.delete(favorite)
    db.session.commit()
    
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    return jsonify({"ok": True, "msg": "Favorite deleted successfully", "payload": [favorite.serialize() for favorite in favorites]}), 204

@api.route('/user', methods=['PUT'])
@jwt_required()
def change_location():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    location = data.get('location')
    lat = data.get('lat')
    lng = data.get('lng')
    
    if not location:
        return jsonify({"ok": False, "msg": "Missing location"}), 400
    if lat is None:
        return jsonify({"ok": False, "msg": "Missing latitude"}), 400
    if lng is None:
        return jsonify({"ok": False, "msg": "Missing longitude"}), 400
    
    user = User.query.get(user_id)
    user.location = location
    user.lat = lat
    user.lng = lng
    db.session.commit()
    
    return jsonify({"ok": True, "msg": "Location updated successfully"}), 200