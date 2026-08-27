# Contributing to FindMyRoomie

Thank you for helping improve FindMyRoomie. Contributions can include bug fixes, features, documentation, tests, design improvements, and technical feedback.

## Before You Start

- Read the [Code of Conduct](CODE_OF_CONDUCT.md).
- Check existing issues and pull requests before starting duplicate work.
- For security vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.
- Do not commit credentials, `.env` files, local Spring configuration, database dumps, uploads, or personal data.

## Fork and Clone

1. Fork the repository on GitHub.
2. Clone your fork and enter the project directory:

```bash
git clone https://github.com/<your-username>/FindMyRoomie.git
cd FindMyRoomie
```

3. Add the upstream repository if you plan to sync changes:

```bash
git remote add upstream https://github.com/<project-owner>/FindMyRoomie.git
```

## Local Setup

### Backend

Prerequisites: Java 17 or newer, Maven 3.9 or newer, and MySQL 8 or newer.

Create the database:

```sql
CREATE DATABASE findmyroomie;
```

Create the local configuration from the safe template and replace placeholders with local values. Keep the resulting `application.properties` untracked.

```powershell
Copy-Item backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
```

Start the API:

```powershell
Set-Location backend
mvn spring-boot:run
```

### Frontend

Prerequisites: Node.js 18 or newer and npm.

Create `frontend/.env` with the local API URL:

```env
VITE_API_BASE=http://localhost:8080
```

Install dependencies and start Vite:

```powershell
Set-Location frontend
npm install
npm run dev
```

The frontend is available at `http://localhost:5173`.

## Create a Branch

Start from an up-to-date branch and use a focused, descriptive branch name:

```bash
git checkout main
git pull upstream main
git checkout -b feature/short-description
```

Examples: `feature/profile-filters`, `fix/chat-reconnect`, `docs/setup-guide`.

## Make and Test Changes

Keep changes focused and preserve the existing React/Vite and Spring Boot patterns. Update documentation when behavior, configuration, or API contracts change.

Run the relevant checks before opening a pull request:

```powershell
Set-Location frontend
npm run lint
npm run build

Set-Location ../backend
mvn test
```

For UI changes, test the affected flow in the browser. For API or WebSocket changes, verify authentication, authorization, validation, and error behavior. Do not add claims to documentation that are not implemented.

## Commit and Push

Write a concise imperative commit message and keep unrelated changes out of the commit:

```bash
git status
git add README.md CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md LICENSE
git commit -m "Improve project documentation"
git push origin feature/short-description
```

Add only the files relevant to your change. Review `git diff --cached` before committing.

## Open a Pull Request

Open a pull request from your branch to the project's default branch. Include:

- The problem and the approach taken
- Relevant issue or discussion links
- Tests and commands run
- Screenshots or a short recording for UI changes
- Configuration, migration, or security notes
- Any known limitations or follow-up work

A pull request should be small enough to review, documented where needed, and ready for a maintainer to run locally.

## Bug Reports

Open an issue with a clear title and include the expected behavior, actual behavior, reproduction steps, environment details, relevant logs with secrets removed, and a minimal example where possible.

## Feature Requests

Explain the user problem first, the proposed behavior, who benefits, alternatives considered, and how success could be evaluated. A feature request is not a commitment to implementation.

## License and Branding

By contributing, you agree that your contribution is provided under the repository's [MIT License](LICENSE). The MIT License applies to source code and documentation; it does not grant permission to use FindMyRoomie trademarks, logo, name, or branding to imply official affiliation or endorsement.
