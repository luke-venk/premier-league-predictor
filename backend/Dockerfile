# Use the latest python image from DockerHub and change the working directory.
FROM python:3.12-slim
WORKDIR /app

# Install dependencies.
# Note: since the build context in docker/prod/docker-compose.yml is the
# project root, need to include "backend/" in the following paths.
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend files over into directory.
COPY backend/ backend/

# Copy model files into the directory as well.
COPY model/ model/

# Expose port 8000.
EXPOSE 8000

# Run the FastAPI server.
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]