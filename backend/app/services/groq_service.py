import os
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv() 
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

system_prompts = {
    "cart": "You are a helpful assistant. When a user asks to buy or prepare something, respond ONLY in this JSON format: {\"action\": \"add\", \"items\": [{\"product_name\": \"string\", \"quantity\": number}]}",
    
    "issue": "You are a bug report assistant. Extract the user's issue into structured JSON. Reply ONLY in this format: {\"issue_type\": \"string\", \"description\": \"string\", \"priority\": \"High|Medium|Low\"}"
}

def try_parse_json(text: str):
    try:
        return json.loads(text)
    except:
        try:
            return eval(text)
        except:
            return None

def call_groq(prompt: str, mode: str = "cart") -> dict:
    print(f"\nCalling Groq in mode: {mode}...")

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompts[mode]},
                {"role": "user", "content": prompt}
            ],
            model="llama3-70b-8192",
            stream=False
        )

        content = response.choices[0].message.content
        print("Groq Response:", content)

        parsed = try_parse_json(content)

        if not isinstance(parsed, dict) or (
            mode == "cart" and "items" not in parsed
        ):
            if mode == "cart":
                print("Retrying in issue mode...")
                return call_groq(prompt, mode="issue")

            return {"error": "Could not understand even as issue."}

        return parsed

    except Exception as e:
        print("Groq API error:", e)
        return {"error": "Groq API failed"}