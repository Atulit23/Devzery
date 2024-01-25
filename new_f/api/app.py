from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
app.app_context().push()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

def user_to_dict(user):
    return {'id': user.id, 'username': user.username, 'email': user.email, 'date_created': user.date_created}

@app.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register_user():
    username = request.json['username']
    email = request.json['email']
    password = generate_password_hash(request.json['password'], method='pbkdf2:sha256')

    existing_user_with_username = User.query.filter_by(username=username).first()
    if existing_user_with_username:
        return jsonify({'message': 'Username is already taken. Please choose a different one.'}), 400

    existing_user_with_email = User.query.filter_by(email=email).first()
    if existing_user_with_email:
        return jsonify({'message': 'Email is already taken. Please use a different one.'}), 400

    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    users = User.query.order_by(User.date_created).all()

    users_list = [user_to_dict(user) for user in users]

    return jsonify(users_list[len(users_list) - 1])

@app.route('/update/<int:user_id>', methods=['PUT'])
@cross_origin(supports_credentials=True)
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if 'username' in request.json:
        user.username = request.json['username']
    if 'email' in request.json:
        user.email = request.json['email']

    db.session.commit()

    user_new = User.query.get(user_id)

    users_list = user_to_dict(user_new)

    return jsonify(users_list)


@app.route('/user/<int:user_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    current_user = user_to_dict(user)
    return jsonify(current_user)

@app.route('/users', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_all_users():
    users = User.query.order_by(User.date_created).all()
    users_list = [user_to_dict(user) for user in users]
    return jsonify(users_list)


@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login_user():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return jsonify({'id': user.id, 'email': user.email, 'message': 'Login successful'})
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == "__main__":
    app.run(debug=True)
