# Security Policy

## Reporting a Vulnerability

Please do not report security vulnerabilities in a public issue. Contact the repository maintainers privately through the security contact configured for this repository. Include:

- A clear description of the vulnerability
- Affected component, endpoint, or file
- Steps to reproduce or a proof of concept that does not expose real data
- Potential impact
- Any suggested mitigation

You will receive a response as soon as reasonably possible. Please allow time for assessment and remediation before public disclosure.

## Secrets and Sensitive Data

Never commit or publish:

- Database usernames or passwords
- JWT secrets, API keys, access tokens, or private certificates
- `.env` files or local Spring `application.properties`
- Production configuration
- Database dumps, logs containing sensitive values, or personal user data
- Real uploaded images or other private user content

Use `backend/src/main/resources/application.properties.example` as the safe starting template and keep the working copy local. The frontend `.env` and backend local configuration are ignored by Git.

If a secret is committed accidentally, rotate it immediately. Removing the file in a later commit does not remove it from Git history.

## Contribution Security Expectations

- Validate authentication and authorization at the server boundary.
- Do not trust client-supplied identity or ownership fields.
- Validate uploaded files and user input.
- Avoid logging credentials, tokens, passwords, or personal data.
- Keep dependencies and runtime versions maintained.
- Explain security-sensitive behavior in the pull request.
