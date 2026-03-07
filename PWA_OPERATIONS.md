# PWA Operations

## Cache Strategy
- App shell cache for core assets.
- Runtime cache for same-origin GET requests.
- `/api/*` excluded from cache.

## Release Process
1. Bump cache version when shell changes.
2. Deploy and verify new service worker activation.
3. Confirm offline fallback behavior.

## Failure Handling
- If stale-cache bug occurs, ship cache version bump and redeploy.
- Provide user instruction to refresh/reopen app for update pickup.
