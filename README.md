# OA Repo Debug Practice

Small, independent Node/Express apps with hidden bugs, for practicing the
"fix the buggy codebase with an AI assistant" part of online assessments.

## How it works
- Each `round-XX-name/` folder is a standalone app with its own tests.
- Goal: make every test pass by fixing the bugs in `src/`. Never edit the tests.
- `main` always holds the buggy version so others can use it. Do your work on a branch:
  `git checkout -b round-01-attempt`

## Run a round
cd round-01-wallet
npm install
npm test

## Recommended loop
1. Run the tests and read only the first failure.
2. Trace that endpoint: route -> controller -> service.
3. Write down what you think is wrong and why BEFORE asking an AI.
4. Use the AI with narrow prompts, then read the diff before accepting it.
5. Re-run the tests. Repeat.

## Rounds
| Round | App | Bugs | Notes |
| :-- | :-- | :-- | :-- |
| 01 | Wallet API | 3 | Backend only |