### Start server

cd /server

npm start

### Start frontend (for dev)

cd /frontend

npm run dev

### Build frontend (to be server by server)

cd /frontend

npm run build

### Add Changeset

npx changeset

### Version

npx changeset version

#### Initial Development (0.y.z):

Start with version 0.1.0 for your first development release. During this phase, increment the minor version (y) for new features and the patch version (z) for bug fixes

#### Pre-release Versions:

Use pre-release identifiers to indicate unstable versions:

0.2.0-alpha.1, 0.2.0-alpha.2, etc. for early, unstable versions

0.2.0-beta.1, 0.2.0-beta.2, etc. for feature-complete but potentially buggy versions

0.2.0-rc.1, 0.2.0-rc.2, etc. for release candidates

#### First Stable Release:

When your API is stable and ready for production, release version 1.0.0.

#### Post-1.0.0 Development:

Increment the patch version (z) for backwards-compatible bug fixes

Increment the minor version (y) for new backwards-compatible features

Increment the major version (x) for any backwards-incompatible changes
