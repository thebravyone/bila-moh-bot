FROM launcher.gcr.io/google/nodejs

# Copy application code.
COPY . /app/

# Install depencencies
RUN apt-get update && \
    apt-get -qqy install --no-install-recommends \
        autoconf \
        automake \
        build-essential \
        ca-certificates \
        git \
        mercurial \
        cmake \
        libass-dev \
        libgpac-dev \
        libtheora-dev \
        libtool \
        libvdpau-dev \
        libvorbis-dev \
        pkg-config \
        texi2html \
        zlib1g-dev \
        libmp3lame-dev \
        wget \
        yasm && \
    apt-get -qqy clean && \
    rm -rf /var/lib/apt/lists/*

# Install app dependencies
RUN npm --unsafe-perm install

# Roda o bash que instala o ffmpeg
ADD script/build.sh /build.sh
RUN ["/bin/bash", "/build.sh"]
