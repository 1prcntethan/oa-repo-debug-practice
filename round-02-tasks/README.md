# Round 02: Task Tracker

A task API plus a tiny frontend client. Fix the bugs so all tests pass. There are 6 bugs,
and at least one lives in the frontend client (`public/api.js`). Never edit the tests.

## Expected behavior
| Method | Path | Body | Success | Errors |
| :-- | :-- | :-- | :-- | :-- |
| GET | /api/tasks | optional ?status=todo or done | 200 + array of tasks | |
| POST | /api/tasks | { title, priority? } | 201 + task (default status "todo", default priority "medium") | 400 if title missing or blank, 400 if priority not low/medium/high |
| GET | /api/tasks/:id | | 200 + task | 404 if not found |
| PATCH | /api/tasks/:id | { title?, status?, priority? } | 200 + task | 400 if status not todo/done or priority invalid, 404 if not found |
| DELETE | /api/tasks/:id | | 204, no body | 404 if not found |

A task looks like { id, title, status, priority }.