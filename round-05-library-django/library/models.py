from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    copies_available = models.PositiveIntegerField(default=1)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "copies_available": self.copies_available,
        }


class Loan(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    borrower = models.CharField(max_length=100)
    returned = models.BooleanField(default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "book_id": self.book_id,
            "borrower": self.borrower,
            "returned": self.returned,
        }