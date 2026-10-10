# Round 01: Wallet API

A small wallet service. Fix the bugs in `src/` so all tests pass. There are 3 bugs.

## Expected behavior
| Method | Path | Body | Success | Errors |
| :-- | :-- | :-- | :-- | :-- |
| POST | /api/wallets | { owner } | 201 + wallet | 400 if owner missing |
| GET | /api/wallets/:id | | 200 + wallet | 404 if not found |
| POST | /api/wallets/:id/deposit | { amount } | 200 + wallet | 400 if amount is not a positive number, 404 if no wallet |
| POST | /api/wallets/:id/withdraw | { amount } | 200 + wallet | 400 if invalid amount or insufficient funds, 404 if no wallet |

A wallet looks like { id, owner, balance }.