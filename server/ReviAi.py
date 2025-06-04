import requests
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import os
import json

app = Flask(__name__, static_folder='../frontend')
socketio = SocketIO(app, cors_allowed_origins="*")

class GeminiChatbot:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        self.base_url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"
        self.headers = {
            'Content-Type': 'application/json',
            'x-goog-api-key': self.api_key
        }
        self.identity = "I am REVI AI, your intelligent chatbot assistant. I am here to help you with your queries and provide meaningful responses."
        self.chat_history = []

    def get_response(self, message: str) -> str:
        try:
            if message.lower() == "who are you":
                return self.identity

            self.chat_history.append({"user": message})
            data = {
                "contents": [{
                    "parts":[{"text": message}]
                }]
            }
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=data
            )
            response.raise_for_status()  # Raise exception for bad status codes
            result = response.json()
            if 'candidates' in result and result['candidates']:
                candidate = result['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    bot_response = candidate['content']['parts'][0].get('text', "Sorry, I couldn't generate a response.")
                    self.chat_history.append({"bot": bot_response})
                    return bot_response
            return "Sorry, I couldn't generate a response."
        except requests.exceptions.RequestException as e:
            return f"API Error: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    def reset_chat(self):
        self.chat_history = []
        return "Chat history has been reset."

    def train(self, training_data: list):
        # Placeholder for training logic
        # In a real-world scenario, this could involve updating a model or saving data
        self.chat_history.extend(training_data)
        return "Training data has been added successfully."

chatbot = GeminiChatbot()

@app.route('/')
def index():
    if app.static_folder is None or not os.path.exists(os.path.join(app.static_folder, 'index.html')):
        raise FileNotFoundError("The 'index.html' file is missing in the static folder.")
    return send_from_directory(app.static_folder, 'index.html')

@socketio.on('message')
def handle_message(message):
    try:
        if message.lower() == "reset":
            response = chatbot.reset_chat()
            emit('response', response)
        else:
            response = chatbot.get_response(message)
            emit('response', response)
    except Exception as e:
        emit('response', f"Error: {str(e)}")

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
