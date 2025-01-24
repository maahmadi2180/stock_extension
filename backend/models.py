from pydantic import BaseModel

class Trade(BaseModel):
    date: str
    symbol: str
    type: str
    price: int
    quantity: int
    fee: int
    reason: str
