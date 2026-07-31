FROM denoland/deno:alpine-2.9.4
ENV DENO_DIR=/deno-dir

WORKDIR /serve/account-center-be

ADD ./dto/deno.jsonc ./dto/
ADD ./dto/src ./dto/src

ADD ./be/deno.jsonc ./be/deno.lock ./be/config.jsonc ./be/
ADD ./be/src ./be/src

WORKDIR /serve/account-center-be/be

RUN deno install --entrypoint ./src/main.ts --frozen

EXPOSE 3000

ENV DATABASE_URL="postgresql://ijia_web@localhost:5432/ijia"
ENV OSS_ROOT_DIR="./store/oss"
ENV LISTEN="0.0.0.0:3000"

CMD ["deno","run","-A","--cached-only", "src/main.ts"] 