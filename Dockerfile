FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Expose Expo ports
EXPOSE 8081 19000 19001 19002

CMD ["bash"]
