# Round 05: Library API (Django)

A small library-lending service. Fix the bugs so all tests pass. There are 6 bugs.
Never edit `library/tests.py`.

## Expected behavior
| Method | Path | Body | Success | Errors |
| :-- | :-- | :-- | :-- | :-- |
| GET | / | | HTML page listing every book title | |
| GET | /api/books/ | optional ?author=Name (exact match, case-insensitive) | 200 + list of books | |
| POST | /api/books/ | { title, author, copies? } | 201 + book (copies defaults to 1) | 400 if title or author missing, 400 if copies is not a non-negative integer |
| GET | /api/books/<id>/ | | 200 + book | 404 if not found |
| POST | /api/books/<id>/borrow/ | { borrower } | 201 + loan, copies_available goes down by 1 | 400 if borrower missing, 404 if no book, 409 if no copies available |
| POST | /api/loans/<id>/return/ | | 200 + loan with returned true, copies_available goes up by 1 | 404 if no loan, 409 if already returned |

A book looks like { id, title, author, copies_available }.
A loan looks like { id, book_id, borrower, returned }.