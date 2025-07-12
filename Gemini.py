import os
import json
import time
import logging
import google.generativeai as genai
from dotenv import load_dotenv
from math_solver import parse_and_solve
from finance_calculator import parse_and_calculate

# === Logging for Fallbacks ===
logging.basicConfig(filename="fallback_logs.txt", level=logging.INFO, format="%(asctime)s - %(message)s")

def safe_send(chat, prompt, retries=1):
    try:
        response = chat.send_message(prompt)
        if response and response.text and response.text.strip():
            return response.text.strip()
        else:
            print("[Notice] Gemini didn't respond. Retrying once...")
            if retries > 0:
                return safe_send(chat, prompt, retries - 1)
            else:
                logging.info(f"Gemini empty fallback for prompt: {prompt}")
                return "I'm having trouble understanding right now. Please rephrase your question or try again later."
    except Exception as e:
        logging.info(f"Gemini exception fallback for prompt: {prompt} | Error: {e}")
        return "Oops, something went wrong while processing your request. Try again in a moment."

# === Load API Key ===
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "models/gemini-2.5-flash"
PROMPT_FILE = "chatbot_system_prompts.json"

# === Load System Prompts ===
def load_prompts():
    if not os.path.exists(PROMPT_FILE):
        print("[ERROR] Missing system prompt file.")
        return {}
    with open(PROMPT_FILE, "r") as f:
        return json.load(f)

# === Load Dataset Entries ===
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

# === Validate Key ===
def validate_key(api_key: str, model: str) -> bool:
    try:
        genai.configure(api_key=api_key)
        models = genai.list_models()
        return any(model.endswith(m.name) for m in models if 'generateContent' in m.supported_generation_methods)
    except Exception as e:
        print("[ERROR] API validation failed:", e)
        return False

# === Initialization ===
if not API_KEY or not validate_key(API_KEY, MODEL_NAME):
    print("[ERROR] Invalid or missing API key.")
    exit(1)

prompts = load_prompts()

model = genai.GenerativeModel(MODEL_NAME)
chat = model.start_chat(history=[])
print(f"\n[INFO] Gemini {MODEL_NAME} chatbot is ready.")

valid_modes = ["/rcbt", "/finance", "/health", "/career", "/math", "/calc"]
active_mode = None
active_system_prompt = None

print("\nCommands: /rcbt | /finance | /health | /career | /math | /calc | /clear | /simulate [mode] | Ctrl+C to exit")

# === Main Loop ===
while True:
    try:
        user_input = input("You: ").strip()
        if not user_input:
            continue

        if user_input.lower() == "/clear":
            model = genai.GenerativeModel(MODEL_NAME, system_instruction=active_system_prompt or "You are a helpful assistant.")
            chat = model.start_chat(history=[])
            print("[INFO] Chat history cleared.")
            continue

        if user_input.lower().startswith("/simulate"):
            parts = user_input.split(" ")
            if len(parts) != 2 or parts[1] not in ["math", "finance", "rcbt", "health"]:
                print("[ERROR] Usage: /simulate math|finance|rcbt|health")
                continue
            mode = parts[1]
            dataset = {
                "math": math_problems,
                "finance": finance_cases,
                "rcbt": rcbt_moods,
                "health": health_entries
            }.get(mode, [])
            print(f"[SIMULATION] Testing {mode} dataset\n")
            for sample in dataset:
                prompt = sample.get("question") or sample.get("mood") or sample.get("entry") or sample.get("scenario")
                if not prompt:
                    continue
                print(f"User: {prompt}")
                print("Gemini:", safe_send(chat, prompt))
                print("-" * 60)
            continue

        elif user_input.lower() in valid_modes:
            mode = user_input[1:]
            active_mode = mode
            active_system_prompt = prompts[mode]["system"]
            model = genai.GenerativeModel(MODEL_NAME, system_instruction=active_system_prompt)
            chat = model.start_chat(history=[])
            print(f"[INFO] Switched to {mode.upper()} mode.")
            continue

        if not active_system_prompt:
            context = detect_context(user_input)
            if context == "ambiguous":
                print("[INFO] Your message could relate to multiple topics.")
                print("[INFO] Please type a specific mode like /rcbt, /finance, /math, or /calc to continue.")
                continue
            elif context:
                active_mode = context
                active_system_prompt = prompts[context]["system"]
                model = genai.GenerativeModel(MODEL_NAME, system_instruction=active_system_prompt)
                chat = model.start_chat(history=[])
                print(f"[Auto] Context detected: {context.upper()} mode engaged.")

        if active_mode == "math":
            def gemini_math_fallback(prompt):
                return f"[Gemini Math]: {safe_send(chat, prompt)}"
            print(parse_and_solve(user_input, fallback_fn=gemini_math_fallback))
            continue

        elif active_mode == "calc":
            def gemini_finance_fallback(prompt):
                return f"[Gemini Finance]: {safe_send(chat, prompt)}"
            print("[CalcBot]:", parse_and_calculate(user_input, fallback_fn=gemini_finance_fallback))
            continue

        # === Default Gemini Response ===
        start = time.time()
        response_text = safe_send(chat, user_input)
        end = time.time()

        print("\nGemini:", response_text)
        print(f"[Response Time: {round(end - start, 2)}s]\n")

    except KeyboardInterrupt:
        print("\n[Session Ended]")
        break
    except Exception as e:
        print("[ERROR]", e)
        continue
