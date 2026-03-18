FROM registry.redhat.io/rhel10/nodejs-24:10.1 AS builder
WORKDIR /opt/app-root/src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM registry.redhat.io/rhel10/nginx-126:10.1
COPY --from=builder /opt/app-root/src/dist/loa-app/browser /opt/app-root/src
CMD ["nginx", "-g", "daemon off;"]
