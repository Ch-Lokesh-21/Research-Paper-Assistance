from fastapi import Response

def set_refresh_token_cookie(response: Response, refresh_token: str, max_age: int):
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=max_age,
        httponly=True,
        secure=False,  
        samesite="lax",
    )

def delete_refresh_token_cookie(response: Response):
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=False,  
        samesite="lax",
    )
