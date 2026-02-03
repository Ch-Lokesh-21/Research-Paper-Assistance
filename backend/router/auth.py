from urllib import response
from fastapi import APIRouter, HTTPException, status, Response, Cookie, Depends, Request
from typing import Optional, Annotated

from schemas import (
    UserSignupRequest,
    UserLoginRequest,
    AuthResponse,
    ErrorResponse,
)
from services import AuthenticationError, auth_service
from utils.refresh_token_cookie import set_refresh_token_cookie, delete_refresh_token_cookie
from crud import RefreshTokenRevocationCRUD

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "User registered successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
        409: {"model": ErrorResponse, "description": "Email already exists"},
    },
    summary="Register a new user",
    description="Create a new user account with email and password.",
)
async def signup(signup_data: UserSignupRequest, response: Response) -> AuthResponse:
    """
    Register a new user.
    Returns JWT access token on successful registration and sets refresh token in cookies.
    """
    try:
        auth_response = await auth_service.signup(signup_data)
        
        if auth_response.refresh_token:
            set_refresh_token_cookie(
                response,
                auth_response.refresh_token,
                auth_response.refresh_token_expires_in,
            )
        
        return auth_response
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=AuthResponse,
    responses={
        200: {"description": "Login successful"},
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
    },
    summary="Login with email and password",
    description="Authenticate user and receive JWT access token.",
)
async def login(login_data: UserLoginRequest, response: Response) -> AuthResponse:
    """
    Authenticate user and get access token.


    Returns JWT access token on successful authentication and sets refresh token in cookies.
    """
    try:
        auth_response = await auth_service.login(login_data)
        
        if auth_response.refresh_token:
            set_refresh_token_cookie(
                response,
                auth_response.refresh_token,
                auth_response.refresh_token_expires_in,
            )
        
        return auth_response
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.post(
    "/logout",
    responses={
        200: {"description": "Logout successful"},
    },
    summary="Logout user",
    description="Logout user and clear refresh token from cookies.",
)
async def logout(request: Request, response: Response) -> dict:
    """
    Logout user and clear refresh token cookie.

    Returns success message.
    """
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        from services.auth_service import AuthService
        try:
            payload = AuthService.decode_token(refresh_token)
            import asyncio
            asyncio.create_task(RefreshTokenRevocationCRUD.revoke(refresh_token, payload.exp))
        except Exception:
            pass
    
    delete_refresh_token_cookie(response)
    return {
        "success": True,
        "message": "Logged out successfully"
    }


@router.post(
    "/refresh",
    response_model=AuthResponse,
    responses={
        200: {"description": "Token refreshed successfully"},
        401: {"model": ErrorResponse, "description": "Invalid refresh token"},
    },
    summary="Refresh access token",
    description="Get a new access token using refresh token from cookies.",
)
async def refresh(refresh_token: Optional[str] = Cookie(None), response: Response = None) -> AuthResponse:
    """
    Returns new access token and sets new refresh token in cookies.
    """
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found in cookies",
        )
    
    try:
        auth_response = await auth_service.refresh_access_token(refresh_token)
        
        if auth_response.refresh_token:
            set_refresh_token_cookie(
                response,
                auth_response.refresh_token,
                auth_response.refresh_token_expires_in,
            )
        
        return auth_response
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
