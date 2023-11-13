
# syntax=docker/dockerfile:1.4
# FROM python:3.11.1-slim

# WORKDIR /code
# COPY requirements.txt /code
# RUN --mount=type=cache,target=/root/.cache/pip \
#     pip3 install -r requirements.txt

# # ENV FLASK_APP app.py
# # ENV FLASK_ENV development
# # ENV FLASK_RUN_PORT 8000
# # ENV FLASK_RUN_HOST 0.0.0.0

# EXPOSE 8000

# CMD ["uvicorn", "./backend/code.app:app", "--host", "0.0.0.0", "--port", "80"]

FROM python:3.9

COPY . /app

WORKDIR /app

RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
