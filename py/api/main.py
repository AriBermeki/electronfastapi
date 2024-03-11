import os

from fastapi import FastAPI

from .core import client, emit, expose  # jsfunction

app = FastAPI()
client(app=app)
_environ = os.environ.copy()


@expose
def main():
    print("hallo")
    emit(event="frompython", data={"message": "hallo from python "})


""" 
async def check_secret(secret_token: str = Header(None)) -> None:
    if _environ.get("SECRET_TOKEN") and secret_token != _environ.get("SECRET_TOKEN"):
        raise HTTPException(status_code=401, detail="Secret Token invalid")

@app.post("/roll", dependencies=[Depends(check_secret)])
async def roll_dice() -> int:
    return random.randint(1, 6) 

    
    

    
"""
