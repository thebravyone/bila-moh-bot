FROM gcr.io/google-appengine/nodejs
RUN add-apt-repository ppa:mc3man/trusty-media
RUN apt-get update
RUN apt-get install ffmpeg
