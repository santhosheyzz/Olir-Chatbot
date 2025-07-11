# Use slim Python base image to reduce size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies and clean up in same layer
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies without cache to reduce size
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    rm -rf ~/.cache/pip

# Copy only necessary application code
COPY main.py .
COPY routers/ ./routers/
COPY models/ ./models/
COPY utils/ ./utils/

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 