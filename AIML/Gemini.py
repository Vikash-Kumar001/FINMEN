# Gemini.py
import flask
from flask import Flask, request, jsonify
import os
import json

import logging
import time
import google.generativeai as genai
from dotenv import load_dotenv
from uuid import uuid4
from math_solver import parse_and_solve
from finance_calculator import parse_and_calculate

# === Setup Logging ===
logging.basicConfig(filename="fallback_logs.txt", level=logging.INFO, format="%(asctime)s - %(message)s")

# === Environment Setup ===
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "models/gemini-2.5-flash"
PROMPT_FILE = "chatbot_system_prompts.json"

# === Prompt Loading ===
def load_prompts():
    if not os.path.exists(PROMPT_FILE):
        print("[ERROR] Missing system prompt file.")
        return {}
    with open(PROMPT_FILE, "r") as f:
        return json.load(f)

prompts = load_prompts()

# === Gemini Setup ===
genai.configure(api_key=API_KEY)
model_instances = {}

# === Dataset Loading (Optional for fallback logic) ===
def load_dataset(name):
    try:
        with open(f"datasets/{name}.json", "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to load {name}.json:", e)
        return []

rcbt_moods = load_dataset("rcbt_moods")
finance_cases = load_dataset("finance_cases")
math_problems = load_dataset("math_problems")
health_entries = load_dataset("health_entries")

# === Context Detection ===
def detect_context(user_input: str):
    user_input_lower = user_input.lower()
    weights = {
        "rcbt": {"fail": 2, "depress": 3, "worthless": 3, "sad": 2, "angry": 2, "hate": 2, "nobody": 2},
        "finance": {"money": 2, "loan": 2, "budget": 2, "save": 2, "interest": 2, "bank": 2, "spend": 1},
        "math": {"solve": 2, "equation": 2, "speed": 2, "distance": 2, "area": 2, "volume": 2, "factor": 2},
        "calc": {"emi": 3, "simple interest": 3, "compound": 2, "inflation": 2, "conversion": 2, "principal": 2, "rate": 2},
        "health": {"exercise": 2, "diet": 2, "stress": 2, "sleep": 2, "healthy": 1, "breakfast": 1, "tired": 1},
        "career": {"job": 2, "interview": 2, "resume": 2, "career": 2, "skills": 2, "courses": 2, "switch": 1, "confused": 1}
    }
    scores = {context: 0 for context in weights}
    for context, keywords in weights.items():
        for word, weight in keywords.items():
            if word in user_input_lower:
                scores[context] += weight
    max_score = max(scores.values())
    top_contexts = [ctx for ctx, score in scores.items() if score == max_score and score > 0]
    if len(top_contexts) == 1:
        return top_contexts[0]
    elif top_contexts:
        return "ambiguous"
    else:
        return None

# === Fallback Wrapper ===
def safe_send(chat, prompt, retries=1):
    try:
        response = chat.send_message(prompt)
        if response and response.text and response.text.strip():
            return response.text.strip()
        else:
            print("[Notice] Gemini didn't respond. Retrying...")
            if retries > 0:
                return safe_send(chat, prompt, retries - 1)
            else:
                logging.info(f"Gemini empty fallback for prompt: {prompt}")
                return "I'm having trouble understanding right now. Please rephrase your question or try again later."
    except Exception as e:
        logging.info(f"Gemini exception fallback for prompt: {prompt} | Error: {e}")
        return "Oops, something went wrong while processing your request. Try again in a moment."

# === Flask-Callable Entry Function ===
def chat_with_gemini(session_id, user_input):
    command_mode_map = {
        "/rcbt": "rcbt",
        "/finance": "finance",
        "/math": "math",
        "/calc": "calc",
        "/health": "health",
        "/career": "career",
        "/general": "general"
    }

    # === Handle Mode Switching Commands ===
    if user_input.strip().lower() in command_mode_map:
        context = command_mode_map[user_input.strip().lower()]
        system_prompt = prompts.get(context, {}).get("system", "You are a helpful assistant.")
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=system_prompt)
        chat = model.start_chat(history=[])
        model_instances[session_id] = (model, chat, context, True)  # mode_locked=True
        return f"Switched to {context.upper()} mode. You can now ask related questions."

    # === Retrieve Session State ===
    session_data = model_instances.get(session_id)

    if session_data:
        model, chat, context, mode_locked = session_data
    else:
        model, chat, context, mode_locked = None, None, None, False

    # === Context Selection ===
    if not mode_locked:
        context = detect_context(user_input)

        if context == "ambiguous":
            return "Your query could relate to multiple topics. Please be more specific."

        if not context:
            context = "general"

        system_prompt = prompts.get(context, {}).get("system", "You are a helpful assistant.")
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=system_prompt)

        # Start new chat with or without prior history (optional)
        if chat:
            chat = model.start_chat(history=chat.history)
        else:
            chat = model.start_chat(history=[])

        model_instances[session_id] = (model, chat, context, False)

    # === Special Delegates ===
    if context == "math":
        return parse_and_solve(user_input, fallback_fn=lambda p: safe_send(chat, p))

    if context == "calc":
        return parse_and_calculate(user_input, fallback_fn=lambda p: safe_send(chat, p))

    return safe_send(chat, user_input)

# === Session ID Generator ===
def generate_session_id():
    return str(uuid4())
