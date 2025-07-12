from fastapi import APIRouter
from app.models.schemas import CartCreate, CartItem, CartResponse
from app.services import cart_service

router = APIRouter()

@router.post("/", response_model=CartResponse)
def create_cart(data: CartCreate):
    items = cart_service.create_cart(data)
    return {"user_id": data.user_id, "items": items}

@router.get("/{user_id}", response_model=CartResponse)
def get_cart(user_id: str):
    items = cart_service.get_cart(user_id)
    return {"user_id": user_id, "items": items}

@router.post("/{user_id}/add", response_model=CartResponse)
def add_to_cart(user_id: str, item: CartItem):
    items = cart_service.add_item(user_id, item)
    return {"user_id": user_id, "items": items}

@router.put("/{user_id}/update", response_model=CartResponse)
def update_cart_item(user_id: str, item: CartItem):
    items = cart_service.update_item(user_id, item)
    return {"user_id": user_id, "items": items}

@router.delete("/{user_id}/remove/{product_name}", response_model=CartResponse)
def remove_cart_item(user_id: str, product_name: str):
    items = cart_service.remove_item(user_id, product_name)
    return {"user_id": user_id, "items": items}

@router.put("/{user_id}/update", response_model=CartResponse)
def update_cart_item(user_id: str, item: CartItem):
    if item.quantity < 1:
        raise ValueError("Quantity must be at least 1")
    items = cart_service.update_item(user_id, item)
    return {"user_id": user_id, "items": items}

@router.delete("/{user_id}/{product_name}")
def remove_item(user_id: str, product_name: str):
    return cart_service.remove_item(user_id, product_name)
