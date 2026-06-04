Describe here all the security policies in place on this repository to help your contributors to handle security issues efficiently.

## Goods practices to follow

:warning:**You must never store credentials information into source code or config file in a GitHub repository** 
- Block sensitive data being pushed to GitHub by git-secrets or its likes as a git pre-commit hook
- Audit for slipped secrets with dedicated tools
- Use environment variables for secrets in CI/CD (e.g. GitHub Secrets) and secret managers in production

# Security Policy

## Supported Versions

This is the currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| < 1.0.3 | :x:                |
| 1.0.3   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report a vulnerability through the issue tracker by specifying the 'security' label.

You can ask for support by contacting security@opensource.thalesgroup.com

## Disclosure policy
In the case a vulnerability is found, you can always contact one of the administrators of this provide to provide more information or create a an issue ticket with the 'security' label. It is important that if you decide to create an issue in the issue tracker that the description of the vulnerability should be high-level and not contain exact exploitation steps. 


## Security Update policy

TBD

## Security related configuration.

TBD 

## Known security gaps & future enhancements.

* Currently the internal browser is used to access internal links (#137)
