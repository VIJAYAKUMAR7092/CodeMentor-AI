from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["POST"])
def chat(request):
    question = request.data.get("question")

    return Response({
        "question": question,
        "answer": "Hello! I am CodeMentor AI. LLM integration coming soon."
    })