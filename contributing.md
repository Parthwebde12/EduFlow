# Contributing to EduFlow

Thanks for taking the time to contribute. This document covers how to get set up, how to submit changes, and what to keep in mind when working on the codebase.

---

## Getting started

Fork the repo, clone your fork, and follow the local setup steps in the README. Make sure both frontend and backend run without errors before making any changes.

```bash
git clone https://github.com/yourusername/eduflow.git
cd eduflow
```

---

## Branch naming

Always work on a branch, never directly on `main`.

```
feat/your-feature-name
fix/what-you-are-fixing
chore/what-you-are-cleaning-up
```

Examples:
```
feat/ai-summary
fix/note-delete-cloudinary
chore/update-dependencies
```

---

## Commit messages

Follow this format:

```
type: short description in present tense
```

Types:
- `feat` — new feature
- `fix` — bug fix
- `chore` — cleanup, deps, config
- `docs` — documentation only
- `style` — formatting, no logic change
- `refactor` — code change that isn't a fix or feature

Examples:
```
feat: add AI summary for uploaded notes
fix: cloudinary delete failing for PDF files
chore: update multer-storage-cloudinary
docs: add API route documentation
```

---

## Pull requests

1. Make sure your branch is up to date with `main` before opening a PR
2. Keep PRs focused — one feature or fix per PR
3. Write a clear description of what changed and why
4. If it fixes a bug, describe how to reproduce the original issue
5. Screenshots are appreciated for UI changes

---

## Code style

- Use `const` and `let`, never `var`
- Async/await over `.then()` chains
- Keep controllers thin — business logic goes in the controller, not the route
- All API responses follow this shape:
  ```json
  { "success": true, "message": "...", "data": {} }
  { "success": false, "message": "..." }
  ```
- Frontend components go in `components/` if reusable, `pages/` if route-level
- Use the existing CSS classes (`btn-primary`, `card`, `input`, `label`) — don't add inline styles

---

## What not to do

- Don't commit `.env` or any file with secrets
- Don't push directly to `main`
- Don't install packages without a clear reason
- Don't leave `console.log` statements in production code

---

## Reporting bugs

Open an issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser and OS if it's a frontend issue

---

## Feature requests

Open an issue describing the feature and why it would be useful for students. Features on the roadmap (AI Summary, Chat, Attendance) are already planned — feel free to pick one up.

---

## Questions

Open an issue with the `question` label and we'll get back to you.