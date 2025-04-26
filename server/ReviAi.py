import google.generativeai as genai
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import os

app = Flask(__name__, static_folder='../frontend')
socketio = SocketIO(app, cors_allowed_origins="*")

class GeminiChatbot:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure Gemini with optimized settings
        genai.configure(api_key=api_key)
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        self.model = genai.GenerativeModel(
            model_name="gemini-pro",
            generation_config=generation_config
        )
        self.chat = self.model.start_chat(history=[])

    def get_response(self, message: str) -> str:
        try:
            response = self.chat.send_message(
                message,
                stream=True
            )
            return " ".join([chunk.text for chunk in response])
        except Exception as e:
            return f"Error: {str(e)}"

    def reset_chat(self):
        self.chat = self.model.start_chat(history=[])

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
