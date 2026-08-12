# Multi-Service Docker Compose Example

Three independent Node.js/Express services, each with its own Dockerfile,
built and pushed together via a single `docker-compose.yml`.

## Structure
```
multi-service-app/
├── docker-compose.yml
├── service-a/
│   ├── Dockerfile
│   ├── app.js
│   ├── package.json
│   └── .dockerignore
├── service-b/  (same layout)
└── service-c/  (same layout)
```

## 1. Set your registry
Edit `docker-compose.yml` and replace `yourregistry` with your actual
registry path, e.g.:
- Docker Hub: `mydockerhubuser/service-a:latest`
- GHCR: `ghcr.io/myorg/service-a:latest`
- AWS ECR: `123456789012.dkr.ecr.us-east-1.amazonaws.com/service-a:latest`

## 2. Log in to your registry
```bash
docker login                     # Docker Hub
# or
docker login ghcr.io             # GitHub Container Registry
# or
aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
```

## 3. Build all images
```bash
docker compose build
```

## 4. Push all images at once
```bash
docker compose push
```

## Build + push in one command
```bash
docker compose build && docker compose push
```

## Run locally (optional)
```bash
docker compose up
```
Then check:
- http://localhost:3001 → Service A
- http://localhost:3002 → Service B
- http://localhost:3003 → Service C

## Notes
- Every service needs an `image:` field — that's the tag `docker compose push` uses.
- For multi-architecture images (amd64 + arm64), use `docker buildx bake` instead of plain compose build/push — let me know if you want that version.

## Routing everything through nginx

A single `nginx` service now sits in front of all three apps and listens on
port 80. Requests are routed to the right backend **by hostname**:

| Hostname            | Routed to   | App              |
|----------------------|-------------|------------------|
| `video.localhost`   | `service-a` | Playhouse        |
| `devops.localhost`  | `service-b` | ControlDeck      |
| `shop.localhost`    | `service-c` | Deskyard         |

Config lives in `nginx/nginx.conf` (base config) and
`nginx/conf.d/default.conf` (the per-host `server` blocks + `proxy_pass`
rules). Each app container is still only reachable inside the Docker network
on port 3000 — nginx is the only thing exposed on the host.

### Run it
```bash
docker compose up --build
```

### Try it
Most browsers/OSes resolve any `*.localhost` hostname to `127.0.0.1`
automatically — no config needed. Just open:
- http://video.localhost
- http://devops.localhost
- http://shop.localhost

**If that doesn't resolve** (some Linux setups need it spelled out), add
these lines to your hosts file — `/etc/hosts` on Mac/Linux,
`C:\Windows\System32\drivers\etc\hosts` on Windows:
```
127.0.0.1 video.localhost
127.0.0.1 devops.localhost
127.0.0.1 shop.localhost
```

### How the routing works
1. Browser sends a request to `nginx` (port 80) with a `Host` header like
   `video.localhost`.
2. Nginx matches that `Host` against the `server_name` in
   `nginx/conf.d/default.conf`.
3. The matching `server` block does `proxy_pass http://service-a:3000;` —
   `service-a` resolves via Docker's internal DNS since it's the compose
   service name, no IP addresses needed.
4. The app responds, nginx forwards it back to the browser.

### Want path-based routing instead? (e.g. `localhost/video`, `localhost/shop`)
That's possible too, but because each app currently references its own
assets with absolute paths (`/style.css`, `/script.js`, `/api/...`), a shared
path prefix needs either a `<base href="...">` tag added to each `index.html`
or an nginx `sub_filter` rewrite — otherwise all three apps' `/style.css`
requests collide on the same route. Subdomain routing (above) avoids that
entirely, which is why it's the default here. Let me know if you'd rather
switch to path-based and I'll wire up the rewrites.
