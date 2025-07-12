from fastapi import APIRouter, UploadFile, Form, File
from app.models.schemas import ChatInput, CartItem
from app.services import groq_service, cart_service, ocr_service, issue_service
import easyocr
from fastapi import UploadFile

router = APIRouter()
reader = easyocr.Reader(['en']) 

@router.post("/")
def chatbot_cart_handler(data: ChatInput):
    """
    Chatbot endpoint that takes user message and updates cart using Groq LLM.
    """
    user_msg = data.message.strip().lower()

    # Respond to greetings and general questions
    if user_msg in ["hi", "hello", "hey", "what can you do", "what do you do"]:
        return {
            "message": (
                "Hey there! 👋 I'm SmartCart AI — your smart shopping assistant.\n\n"
                "**Here’s how you can use me:**\n"
                "1. 🛒 *Tell me the items directly* — e.g., `1 milk, 2 bread`\n"
                "2. 🎉 *Describe the occasion* — e.g., `items needed for a birthday party`\n"
                "3. 🐞 *Report a problem* — e.g., `I'm not able to add items`\n\n"
                "Let me know how I can help!"
            )
        }

    # Call Groq to interpret the message
    groq_result = groq_service.call_groq(data.message, mode="cart")

    # If items were extracted
    if "items" in groq_result and isinstance(groq_result["items"], list):
        for item in groq_result["items"]:
            try:
                cart_service.add_item(data.user_id, CartItem(**item))
            except Exception as e:
                print(f"Failed to add item: {item} | Error: {e}")
        return {
            "message": "🛍️ Items added successfully!",
            "cart": cart_service.get_cart(data.user_id)
        }

    # Handle issue response if fallback switched to issue mode
    if "issue_type" in groq_result:
        from app.models.schemas import Issue

        issue = Issue(
            user_id=data.user_id,
            issue_type=groq_result["issue_type"],
            description=groq_result["description"],
            priority=groq_result["priority"]
        )
        issue_service.save_issue(issue)  # ✅ SAVE THE ISSUE HERE

        return {
            "message": (
                f"🛠️ Thanks! I've logged your issue as: **{groq_result['issue_type']}**.\n\n"
                f"📋 Description: {groq_result['description']}\n"
                f"⏱️ Priority: {groq_result['priority']}"
            ),
            "issue": groq_result
        }


    # Final fallback
    return {
        "message": (
            "Sorry, I couldn't understand that message. 😅\n\n"
            "**Try one of the following:**\n"
            "1. 🛒 *Tell me items directly* — e.g., `1 milk, 2 eggs`\n"
            "2. 🎯 *Describe what you're planning* — e.g., `items for a dinner party`\n"
            "3. 🐞 *Report an issue* — e.g., `cart not updating`\n\n"
            "I'm here to help!"
        ),
        "groq_response": groq_result
    }


@router.post("/image")
async def handle_image_chat(user_id: str = Form(...), image: UploadFile = Form(...)):
    text = ocr_service.extract_text_from_image(image.file)

    result = groq_service.call_groq(text, mode="cart")

    if "items" in result:
        for item in result["items"]:
            cart_service.add_item(user_id, CartItem(**item))

        return {
            "message": "Items added from image",
            "extracted_text": text,
            "cart": cart_service.get_cart(user_id)
        }

    return {
        "message": "Could not understand image content",
        "extracted_text": text,
        "groq_response": result
    }

@router.post("/ocr/test")
async def test_ocr_easyocr(image: UploadFile = File(...)):
    image.file.seek(0)
    img_bytes = await image.read()
    # Pass bytes to EasyOCR
    result = reader.readtext(img_bytes, detail=0)
    text = " ".join(result)
    return {"extracted_text": text.strip()}

