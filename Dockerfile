FROM library/node:12.19.0-alpine

ENV SERVICE_HOME_DIR=/app \
    SERVICE_USER=coin-searcher-service \
    SERVICE_GROUP=coin-searcher-service \
    NODE_ENV='production'

COPY . ${SERVICE_HOME_DIR}
WORKDIR ${SERVICE_HOME_DIR}

RUN set -x \
 && apk add --no-cache --virtual \
      --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ --allow-untrusted \
      git \
      gosu \
      openssh-client \
 && addgroup -S "${SERVICE_GROUP}" \
 && adduser -h "${SERVICE_HOME_DIR}" \
            -g "Service,,,," \
            -s /bin/false \
            -G "${SERVICE_GROUP}" \
            -S -D "${SERVICE_USER}" \
 && chown -R "${SERVICE_USER}:${SERVICE_GROUP}" \
      "${SERVICE_HOME_DIR}" \
 && mv docker-entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
STOPSIGNAL SIGINT
EXPOSE 3000