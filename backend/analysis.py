from fastapi import APIRouter, HTTPException
from models import Trade
from openai import OpenAI
import os
import json
from fastapi.responses import JSONResponse

router = APIRouter()

def get_deepseek_client():
    return OpenAI(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url="https://api.deepseek.com/v1",
        timeout=30.0
    )

async def get_ai_analysis(trades: list):
    client = get_deepseek_client()
    
    prompt = f"""
    تحلیل پیشرفته معاملات با مشخصات زیر:
    {json.dumps(trades, indent=2, ensure_ascii=False)}
    
    لطفا تحلیل خود را به زبان فارسی و با ساختار زیر ارائه دهید:
    1. خلاصه عملکرد
    2. نقاط قوت و ضعف
    3. پیشنهادات بهبود
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "شما یک تحلیلگر مالی حرفه‌ای هستید"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
        
    except Exception as e:
        print("Deepseek API Error:", str(e))
        raise HTTPException(status_code=500, detail=f"خطای API: {str(e)}")

@router.post("/analyze")
async def analyze_trades(trades: list[Trade]):
    try:
        if len(trades) < 3:
            raise HTTPException(
                status_code=400,
                detail="حداقل ۳ معامله برای تحلیل الزامی است"
            )

        trade_data = [{
            "date": t.date,
            "symbol": t.symbol,
            "type": t.type,
            "price": t.price,
            "quantity": t.quantity,
            "fee": t.fee,
            "reason": t.reason
        } for t in trades]

        analysis = await get_ai_analysis(trade_data)
        
        return JSONResponse({
            "status": "success",
            "analysis": analysis,
            "stats": {
                "total_trades": len(trades),
                "total_volume": sum(t.quantity for t in trades),
                "total_fees": sum(t.fee for t in trades)
            }
        })
        
    except Exception as e:
        print("Server Error:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"خطای سرور: {str(e)}"
        )