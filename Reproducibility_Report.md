# Reproducibility Report

## Objective

This report documents the steps taken to verify that the project can be successfully reproduced in a clean environment.

## Environment

- Operating System: Windows 11
- Python: 3.11
- Node.js: 20.x
- PostgreSQL: 16
- Browser: Google Chrome

## Installation Steps

1. Clone the repository.
2. Create a Python virtual environment.
3. Install backend dependencies.
4. Install frontend dependencies.
5. Configure the `.env` file.
6. Start PostgreSQL.
7. Run the backend.
8. Run the frontend.

## Issues Encountered

- Missing environment variables before creating `.env`.
- Required AWS credentials for Bedrock access.
- PostgreSQL service must be running before starting the backend.

## Resolution

- Added `.env.example` template.
- Verified all required Python packages are listed in `requirements.txt`.
- Confirmed successful startup after dependency installation.

## Clean Run Result

The project was successfully executed in a clean virtual environment. The frontend loaded correctly, the backend started without errors, and document upload and semantic search worked as expected.

## Conclusion

The application can be reproduced by following the README instructions and configuring the required environment variables.
