# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirement.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirement.txt

# Copy all files
COPY . .

# Expose the port Flask will run on
EXPOSE 5000

# Run Flask app
CMD ["python", "server.py"]
