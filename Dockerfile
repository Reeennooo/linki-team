FROM node:16-alpine AS deps

ARG DOCK_USER_ID=1001
ENV DOCK_USER_ID ${DOCK_USER_ID}
ARG DOCK_GROUP_ID=1001
ENV DOCK_GROUP_ID ${DOCK_GROUP_ID}

# persistent dependencies
RUN apk add --no-cache \
# in theory, docker-entrypoint.sh is POSIX-compliant, but priority is a working, consistent image
		bash \
		git \
# BusyBox sed is not sufficient for some of our sed expressions
		sed \
# Ghostscript is required for rendering PDF previews
		ghostscript

RUN set -xe; \
   	addgroup -g ${DOCK_GROUP_ID} dock && adduser -D -G node -s /bin/bash  -u ${DOCK_USER_ID} dock && addgroup dock dock;

USER dock

WORKDIR /app


EXPOSE 3000
CMD npm install && npm run build && npm run start
