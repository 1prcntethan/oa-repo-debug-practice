import json

from django.test import TestCase

from .models import Book, Loan


def make_book(title="Dune", author="Frank Herbert", copies=1):
    return Book.objects.create(title=title, author=author, copies_available=copies)


def post_json(client, path, payload):
    return client.post(path, data=json.dumps(payload), content_type="application/json")


class IndexPageTests(TestCase):
    def test_index_page_lists_books(self):
        make_book(title="Dune")
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "Dune")


class BookListTests(TestCase):
    def test_list_books_returns_all(self):
        make_book(title="Alpha")
        make_book(title="Beta")
        res = self.client.get("/api/books/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 2)

    def test_list_books_filters_by_author_exactly(self):
        make_book(title="Alpha", author="Ann Lee")
        make_book(title="Beta", author="Ann Leeson")
        res = self.client.get("/api/books/", {"author": "ann lee"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual([b["title"] for b in res.json()], ["Alpha"])

    def test_create_book(self):
        res = post_json(self.client, "/api/books/", {"title": "Dune", "author": "Frank Herbert"})
        self.assertEqual(res.status_code, 201)
        body = res.json()
        self.assertEqual(body["title"], "Dune")
        self.assertEqual(body["copies_available"], 1)
        self.assertEqual(Book.objects.count(), 1)

    def test_create_book_requires_title_and_author(self):
        res = post_json(self.client, "/api/books/", {"author": "Frank Herbert"})
        self.assertEqual(res.status_code, 400)

    def test_create_book_rejects_negative_copies(self):
        res = post_json(
            self.client, "/api/books/", {"title": "A", "author": "B", "copies": -1}
        )
        self.assertEqual(res.status_code, 400)


class BookDetailTests(TestCase):
    def test_get_book(self):
        book = make_book(title="Dune")
        res = self.client.get(f"/api/books/{book.id}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["title"], "Dune")

    def test_get_unknown_book_returns_404(self):
        res = self.client.get("/api/books/999/")
        self.assertEqual(res.status_code, 404)


class BorrowTests(TestCase):
    def test_borrow_creates_loan_and_decrements_copies(self):
        book = make_book(copies=2)
        res = post_json(self.client, f"/api/books/{book.id}/borrow/", {"borrower": "Sam"})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json()["borrower"], "Sam")
        book.refresh_from_db()
        self.assertEqual(book.copies_available, 1)

    def test_borrow_without_borrower_returns_400(self):
        book = make_book()
        res = post_json(self.client, f"/api/books/{book.id}/borrow/", {})
        self.assertEqual(res.status_code, 400)

    def test_borrow_when_no_copies_returns_409(self):
        book = make_book(copies=0)
        res = post_json(self.client, f"/api/books/{book.id}/borrow/", {"borrower": "Sam"})
        self.assertEqual(res.status_code, 409)

    def test_borrow_unknown_book_returns_404(self):
        res = post_json(self.client, "/api/books/999/borrow/", {"borrower": "Sam"})
        self.assertEqual(res.status_code, 404)


class ReturnTests(TestCase):
    def test_return_loan_marks_returned_and_restores_copy(self):
        book = make_book(copies=0)
        loan = Loan.objects.create(book=book, borrower="Sam")
        res = self.client.post(f"/api/loans/{loan.id}/return/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["returned"])
        book.refresh_from_db()
        self.assertEqual(book.copies_available, 1)

    def test_return_already_returned_loan_returns_409(self):
        book = make_book(copies=1)
        loan = Loan.objects.create(book=book, borrower="Sam", returned=True)
        res = self.client.post(f"/api/loans/{loan.id}/return/")
        self.assertEqual(res.status_code, 409)

    def test_return_unknown_loan_returns_404(self):
        res = self.client.post("/api/loans/999/return/")
        self.assertEqual(res.status_code, 404)