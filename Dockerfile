FROM python:3
WORKDIR /usr/src/app
COPY docker.html index.html
COPY index.js .
COPY index.css .
COPY normalize.css .
COPY skeleton.css .
CMD [ "python", "-m", "http.server", "8000" ]