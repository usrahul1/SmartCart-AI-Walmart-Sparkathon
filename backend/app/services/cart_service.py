from typing import Dict, List
from app.models.schemas import CartItem, CartCreate

# In-memory "cart" store: { user_id: [CartItem, ...] }
fake_cart_db: Dict[str, List[CartItem]] = {}

def create_cart(data: CartCreate):
    fake_cart_db[data.user_id] = data.items or []
    return fake_cart_db[data.user_id]

def get_cart(user_id: str):
    return fake_cart_db.get(user_id, [])

def add_item(user_id: str, item: CartItem):
    cart = fake_cart_db.get(user_id, [])

    normalized_name = item.product_name.strip().title()
    item.product_name = normalized_name

    for i in cart:
        if i.product_name.strip().lower() == normalized_name.lower():
            i.quantity += item.quantity
            break
    else:
        cart.append(item)

    fake_cart_db[user_id] = cart
    return cart


def update_item(user_id: str, item: CartItem):
    cart = fake_cart_db.get(user_id, [])
    for i in cart:
        if i.product_name == item.product_name:
            i.quantity = item.quantity
            break
    fake_cart_db[user_id] = cart
    return cart

def remove_item(user_id: str, product_name: str):
    cart = fake_cart_db.get(user_id, [])
    cart = [i for i in cart if i.product_name != product_name]
    fake_cart_db[user_id] = cart
    return cart
