FROM launcher.gcr.io/google/nodejs

# Copy application code.
COPY . /app/

# Install apt repo and update
ADD sources.list /etc/apt/
RUN apt-get update

# Install ffmpeg
RUN apt-get install -y wget file python-software-properties
RUN add-apt-repository -y ppa:jon-severinsson/ffmpeg
RUN apt-get update
RUN apt-get install -y ffmpeg

# Install app dependencies
RUN npm --unsafe-perm install
