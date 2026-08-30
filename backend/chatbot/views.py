from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Chat

import os
from groq import Groq
from django.conf import settings

@api_view(["POST"])
@permission_classes([AllowAny])
def chat(request):
    client = Groq(api_key=settings.GROQ_API_KEY)

    question = request.data.get("question", "").strip()
    session_id = request.data.get("session_id", "default_session")

    if not question:
        return Response(
            {"error": "Question is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        completion = client.chat.completions.create(
            model="groq/compound",
            messages=[
                {
                    "role": "system",
                    "content": """
You are CodeMentor AI.
You help users with Python, Django, React, Next.js, SQL, DSA, JavaScript and programming.

Always answer in clean Markdown.
Use headings, bullet points and code blocks whenever required.
"""
                },
                {
                    "role": "user",
                    "content": question
                }
            ]
        )
        answer = completion.choices[0].message.content
    except Exception as e:
        answer = f"**Error connecting to AI Provider (Groq)**:\n\n```\n{str(e)}\n```\n\n*Note: This is likely a network issue or the Groq API key is invalid. Please check your internet connection, VPN, or `.env` file.*"

    chat = Chat.objects.create(
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id,
        question=question,
        answer=answer
    )

    return Response({
        "id": chat.id,
        "question": chat.question,
        "answer": chat.answer,
        "created_at": chat.created_at,
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def chat_history(request):
    
    session_id = request.query_params.get("session_id", "default_session")

    if request.user.is_authenticated:
        chats = Chat.objects.filter(user=request.user).order_by("-created_at")
    else:
        chats = Chat.objects.filter(session_id=session_id).order_by("-created_at")

    return Response([
        {
            "id": chat.id,
            "question": chat.question,
            "answer": chat.answer,
            "created_at": chat.created_at,
        }
        for chat in chats
    ])