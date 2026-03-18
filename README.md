# Step-Up Authentication with Keycloak

This project demonstrates **Step-Up Authentication** using [Keycloak](https://www.keycloak.org/) and Angular. It showcases how to enforce different Authentication Assurance Levels (AAL) — from password-only (AAL1) up to passkey/WebAuthn (AAL3) — using Keycloak's Level of Assurance (LoA) feature.

Three separate Angular app instances are served, each requiring a different authentication level:

| App     | Port   | Required AAL | Authentication method           |
|---------|--------|--------------|---------------------------------|
| AAL1    | 8180   | AAL1         | Password only                   |
| AAL2    | 8280   | AAL2         | Password + OTP (TOTP)           |
| AAL3    | 8380   | AAL3         | Passkey (WebAuthn passwordless) |

---

## Prerequisites

- [Podman](https://podman.io/get-started)
- Access to the Red Hat container registry (`registry.redhat.io`) — log in with `podman login registry.redhat.io` if needed

---

## Running the stack

```bash
podman compose up --build
```

This will start:
- **Keycloak** at `http://localhost:8080` (admin: `admin` / `admin`), pre-configured with the `example` realm and user `otto` (password: `otto`)
- **AAL1 app** at `http://localhost:8180`
- **AAL2 app** at `http://localhost:8280`
- **AAL3 app** at `http://localhost:8380`

---

## First-time user setup

The user `otto` is pre-created but requires two credentials to be configured before accessing AAL2 and AAL3 apps: an **OTP authenticator** and a **passkey**.

These actions are triggered automatically when `otto` first logs in.

### 1. Configure OTP (required for AAL2)

1. Open `http://localhost:8280` and click **Login**.
2. Enter credentials: username `otto`, password `otto`.
3. Keycloak will prompt you to **set up an authenticator app** (TOTP).
4. Scan the QR code with an authenticator app (e.g. Google Authenticator, Aegis, or FreeOTP).
5. Enter the generated one-time code and click **Submit**.

OTP is now configured. You can access the AAL2 app normally on subsequent logins.

### 2. Configure Passkey (required for AAL3)

1. Open `http://localhost:8380` and click **Login**.
2. Enter credentials: username `otto`, password `otto`, then the OTP code if prompted.
3. Keycloak will prompt you to **register a passkey** (WebAuthn passwordless).
4. Follow your browser's prompt to register a passkey (e.g. Touch ID, Windows Hello, or a hardware security key).
5. Complete the registration and confirm.

Passkey is now configured. The AAL3 app will use the registered passkey for authentication on subsequent logins.

> **Note:** Both setup steps can also be triggered from `http://localhost:8180` (AAL1 app). On first login, Keycloak will walk you through configuring both credentials sequentially.

---

## Keycloak admin console

Access the admin console at `http://localhost:8080` with credentials `admin` / `admin`.

The `example` realm is pre-imported with:
- Clients: `aal1-app`, `aal2-app`, `aal3-app` — each mapped to the corresponding LoA level
- User: `otto` — password `otto`, OTP and passkey setup required on first login

---

## Development

To run the Angular app locally (outside Podman):

```bash
npm install
ng serve
```

The app will be available at `http://localhost:4200/`. Update `src/assets/config/config.json` to point to the desired Keycloak realm and client.

### Build

```bash
ng build
```

Build artifacts are output to the `dist/` directory.

### Unit tests

```bash
ng test
```
