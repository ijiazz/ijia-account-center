FROM denoland/deno:debian-2.7.14
ENV DENO_DIR=/deno-dir

WORKDIR /serve/account-center-be

ADD ./dto/deno.jsonc ./dto/
ADD ./dto/src ./dto/src

ADD ./be/deno.jsonc ./be/deno.lock ./be/config.jsonc ./be/
ADD ./be/src ./be/src

WORKDIR /serve/account-center-be/be

RUN deno install --entrypoint ./src/main.ts --frozen

VOLUME [ "/data/oss","/data/app" ]
ENV APP_DATA_DIR=/data/app
ENV OSS_ROOT_DIR=/data/oss

ENV DATABASE_URL="pg://ijia_mr@postgres:5432/ijia"
EXPOSE 9000

CMD ["deno","run","-A","--cached-only", "src/main.ts"] 