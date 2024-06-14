"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Blueprint, request, jsonify
from api.models import db, User, Favorites
from api.utils import APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token
import sendgrid
from sendgrid.helpers.mail import Mail
import requests
import os
from datetime import datetime, timedelta

api = Blueprint('api', __name__)

@api.route('/users', methods=['POST'])
def create_user():
    print("create_user endpoint reached")
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    location = data.get("location").get('location')
    lat = data.get("location").get('lat')
    lng = data.get("location").get('lng')
    
    if not location or lat is None or lng is None:
        return jsonify({"ok": False, "msg": "Location missing"}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"ok": False, "msg": "User already exists"}), 401
    
    new_user = User(email=email, location=location, lat=lat, lng=lng)
    new_user.set_password(password)
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
    if not user or not user.check_password(password):
        return jsonify({"ok": False, "msg": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
    return jsonify({"ok": True, "msg": "User authenticated successfully", "payload": {
        "access_token": access_token,
        "user_id": user.id,
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
        'size' : '100',
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

    def get_widest_image_url(event):
        # Initialize variables to keep track of the widest image
        widest_image_url = None
        max_width = 0
        
        # Loop through the images in the event
        for image in event.get('images', []):
            # Get the width of the current image
            width = image.get('width', 0)
            
            # If the current image is wider than the previously found widest image
            if width > max_width:
                max_width = width
                widest_image_url = image.get('url')
        
        return widest_image_url

    for event in events_data.get('_embedded', {}).get('events', []):
        venue = event.get('_embedded', {}).get('venues', [])[0] if event.get('_embedded', {}).get('venues') else {}
        events.append({
            "id": event.get('id'),
            "title": event.get('name'),
            "startTime": event.get('dates', {}).get('start', {}).get('dateTime'),
            "description": event.get('pleaseNote') or event.get('info') or "No description available.",
            "location": venue.get('name'),
            "imageURL": get_widest_image_url(event) if event.get('images') else None,
            "address": f"{venue.get('address', {}).get('line1')}, {venue.get('city', {}).get('name')}, {venue.get('state', {}).get('name')}, {venue.get('country', {}).get('name')}, {venue.get('postalCode')}"
        })

    return jsonify({"ok": True, "msg": "Events fetched successfully", "payload": events}), 200

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        user_id = get_jwt_identity()
        
        # Check if the user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"ok": False, "msg": "User not found"}), 404
        
        # Retrieve favorites
        favorites = Favorites.query.filter_by(user_id=user_id).all()
        
        if not favorites:
            return jsonify({"ok": True, "msg": "No favorites found", "payload": []}), 200

        return jsonify({"ok": True, "msg": "Favorites retrieved successfully", "payload": [favorite.serialize() for favorite in favorites]}), 200

    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({"ok": False, "msg": "Database error"}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"ok": False, "msg": "An unexpected error occurred"}), 500

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    title = data.get('title')
    start_time = data.get('startTime')
    location = data.get('location')
    address = data.get('address')
    
    if not title or not start_time or not location or not address:
        return jsonify({"ok": False, "msg": "Missing title, start time, or location"}), 400
    
    try:
        new_favorite = Favorites(
            user_id=user_id,
            title=title,
            startTime=datetime.fromisoformat(start_time.replace("Z", "+00:00")),
            location=location,
            address=address,
            description=data.get('description'),
            imageURL=data.get('imageURL')
        )
        db.session.add(new_favorite)
        db.session.commit()
        
        favorites = Favorites.query.filter_by(user_id=user_id).all()
        return jsonify({"ok": True, "msg": "Favorite added successfully", "payload": [favorite.serialize() for favorite in favorites]}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500

@api.route('/favorites/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    user_id = get_jwt_identity()
    favorite = Favorites.query.filter_by(id=id, user_id=user_id).first()
    
    if not favorite:
        return jsonify({"ok": False, "msg": "Favorite not found"}), 404
    
    try:
        db.session.delete(favorite)
        db.session.commit()
        
        favorites = Favorites.query.filter_by(user_id=user_id).all()
        return jsonify({"ok": True, "msg": "Favorite deleted successfully", "payload": [favorite.serialize() for favorite in favorites]}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500

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

@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"ok": False, "msg": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"ok": False, "msg": "User not found"}), 404
    
    reset_token = create_access_token(identity=email, expires_delta=timedelta(minutes=10))
    reset_url = f'{os.getenv("FRONTEND_URL")}/passwordChange?token={reset_token}'
    send_reset_email(user.email, reset_url)
    
    return jsonify({"ok": True, "msg": "Password change email sent"}), 200

def send_reset_email(to_email, reset_url):
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
    from_email = os.getenv('FROM_EMAIL')
    subject = "Password Reset Request"
    content = f"Click the link to reset your password: {reset_url}"
    message = Mail(from_email=from_email, to_emails=to_email, subject=subject, html_content=content)
    sg.send(message)

@api.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password():
    data = request.get_json()
    new_password = data.get('new_password')
    email = get_jwt_identity()
    
    if not new_password or new_password == "":
        return jsonify({"ok": False, "msg": "New password required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"ok": False, "msg": "User not found"}), 404
    
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({"ok": True, "msg": "Password has been reset"}), 200