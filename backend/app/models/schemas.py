from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    product_name: str
    quantity: int

class CartCreate(BaseModel):
    user_id: str
    items: Optional[List[CartItem]] = []

class CartUpdate(BaseModel):
    product_name: str
    quantity: int

class CartResponse(BaseModel):
    user_id: str
    items: List[CartItem]

class ChatInput(BaseModel):
    user_id: str
    message: str
    
class IssueReportInput(BaseModel):
    user_id: str
    message: str

class Issue(BaseModel):
    user_id: str
    issue_type: str
    description: str
    priority: str
