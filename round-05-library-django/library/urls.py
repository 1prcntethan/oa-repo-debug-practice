from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/books/", views.book_list, name="book-list"),
    path("api/books/<int:book_id>/", views.book_detail, name="book-detail"),
    path("api/books/<int:book_id>/borrow/", views.borrow_book, name="loan-borrow"),
    path("api/loans/<int:loan_id>/return/", views.return_loan, name="loan-return"),
]