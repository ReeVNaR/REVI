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

    def get_response(self, message: str) -> str:
        try:
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
                return result['candidates'][0]['content']['parts'][0]['text']
            return "Sorry, I couldn't generate a response."
        except requests.exceptions.RequestException as e:
            return f"API Error: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    def reset_chat(self):
        return "Chat history has been reset."

chatbot = GeminiChatbot()

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@socketio.on('message')
def handle_message(message):
    try:
        if message.lower() == "reset":
            chatbot.reset_chat()
            emit('response', "Chat history has been reset.")
        else:
            response = chatbot.get_response(message)
            emit('response', response)
    except Exception as e:
        emit('response', f"Error: {str(e)}")

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
