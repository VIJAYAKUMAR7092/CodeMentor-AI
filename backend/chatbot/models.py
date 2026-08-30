from django.db import models
from django.contrib.auth.models import User


class Chat(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chats",
        null=True,
        blank=True
    )
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    session_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        user_display = self.user.username if self.user else "Anonymous"
        return f"{user_display} - {self.question[:30]}"