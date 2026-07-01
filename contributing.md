# Contributing to EduFlow

First off, thanks for taking the time to contribute! 🎉 EduFlow is a student
productivity platform, and contributions of all kinds — code, docs, design,
bug reports — are welcome.

## Code of Conduct

This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md). By
participating, you're expected to uphold it.

## How Can I Contribute?

### Reporting Bugs
- Check [existing issues](https://github.com/Parthwebde12/EduFlow/issues) first to avoid duplicates.
- Open a new issue using the **Bug Report** template.
- Include clear steps to reproduce, expected vs actual behavior, and screenshots if relevant.

### Suggesting Features
- Open an issue using the **Feature Request** template.
- Explain the problem it solves and why it'd be useful.

### Good First Issues
Look for issues labeled `good first issue` if you're new to the project.

## Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/<your-username>/EduFlow.git
cd EduFlow

# 2. Add the original repo as upstream
git remote add upstream https://github.com/Parthwebde12/EduFlow.git

# 3. Install backend dependencies
cd backend
npm install
cp .env.example .env   # fill in your own values

# 4. Install frontend dependencies
cd ../frontend
npm install
```

### Running locally

```bash
# In /backend
npm run dev

# In /frontend (separate terminal)
npm run dev
```

## Making Changes

1. Create a new branch off `main`:
```bash
   git checkout -b feature/short-description
```
2. Make your changes, following the existing code style.
3. Test your changes locally (both frontend and backend, if applicable).
4. Commit with a clear message:
```bash
   git commit -m "Add: short description of change"
```
5. Push to your fork and open a Pull Request against `main`.

### Commit Message Convention
Prefix commits where possible:
- `Add:` new feature
- `Fix:` bug fix
- `Docs:` documentation changes
- `Refactor:` code change that doesn't fix a bug or add a feature
- `Chore:` maintenance tasks

## Pull Request Process

- Fill out the PR template completely.
- Link the related issue (e.g. `Fixes #12`).
- Make sure your branch is up to date with `main` before requesting review.
- A maintainer will review and may request changes before merging.

## Style Guidelines
- Keep components/functions small and focused.
- Match existing naming conventions in `frontend/` and `backend/`.
- Avoid committing `.env`, `node_modules`, or build artifacts.

## Questions?

Open a [discussion](https://github.com/Parthwebde12/EduFlow/issues) or start
a new issue — happy to help!

Thanks again for contributing to EduFlow! 🚀