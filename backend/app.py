from flask import Flask
from routes.api_routes import api_routes

app = Flask(__name__)

# Register API routes
app.register_blueprint(api_routes)


@app.route("/")
def index():
    return "Social Media Analytics Backend is running!"


if __name__ == "__main__":
    app.run(debug=True)
