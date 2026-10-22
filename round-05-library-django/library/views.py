import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from .models import Book, Loan


def parse_json(request):
    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return None
    return data if isinstance(data, dict) else None


def error(message, status):
    return JsonResponse({"error": message}, status=status)


def find_book(book_id):
    return Book.objects.filter(pk=book_id).first()


def index(request):
    books = Book.objects.order_by("title")
    return render(request, "library/index.html", {"books": books})


@require_http_methods(["GET", "POST"])
def book_list(request):
    if request.method == "GET":
        queryset = Book.objects.order_by("id")
        author = request.GET.get("author")
        if author:
            queryset = queryset.filter(author__iexact=author)
        return JsonResponse([book.to_dict() for book in queryset], safe=False)

    data = parse_json(request)
    if data is None:
        return error("invalid JSON body", 400)
    title = data.get("title")
    author = data.get("author")
    copies = data.get("copies", 1)
    if not title or not author:
        return error("title and author are required", 400)
    if not isinstance(copies, int) or isinstance(copies, bool) or copies < 0:
        return error("copies must be a non-negative integer", 400)
    book = Book.objects.create(title=title, author=author, copies_available=copies)
    return JsonResponse(book.to_dict(), status=201)


@require_http_methods(["GET"])
def book_detail(request, book_id):
    book = find_book(book_id)
    if book is None:
        return error("book not found", 404)
    return JsonResponse(book.to_dict())


@require_http_methods(["POST"])
def borrow_book(request, book_id):
    data = parse_json(request)
    if data is None:
        return error("invalid JSON body", 400)
    borrower = data.get("borrower")
    if not borrower:
        return error("borrower is required", 400)
    book = find_book(book_id)
    if book is None:
        return error("book not found", 404)
    if book.copies_available < 1:
        return error("no copies available", 409)
    loan = Loan.objects.create(book=book, borrower=borrower)
    loan.book.copies_available -= 1
    loan.book.save()
    return JsonResponse(loan.to_dict(), status=201)


@require_http_methods(["POST"])
def return_loan(request, loan_id):
    loan = Loan.objects.filter(pk=loan_id).select_related("book").first()
    if loan is None:
        return error("loan not found", 404)
    if loan.returned:
        return error("loan already returned", 409)
    loan.returned = True
    loan.save()
    loan.book.copies_available += 1
    loan.book.save()
    return JsonResponse(loan.to_dict(), status=200)