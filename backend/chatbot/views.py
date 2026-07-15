from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Chat

import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat(request):

    question = request.data.get("question", "").strip()

    if not question:
        return Response(
            {"error": "Question is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
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

    chat = Chat.objects.create(
        user=request.user,
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
@permission_classes([IsAuthenticated])
def chat_history(request):

    chats = Chat.objects.filter(
        user=request.user
    ).order_by("-created_at")

    return Response([
        {
            "id": chat.id,
            "question": chat.question,
            "answer": chat.answer,
            "created_at": chat.created_at,
        }
        for chat in chats
    ])