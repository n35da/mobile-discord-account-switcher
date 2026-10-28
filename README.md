# Mobile Discord Account Switcher

An [Unbound](https://unbound.rip) plugin that unlocks Discord's built-in multi-account switcher on iOS.

Discord's iOS app already contains a full multi-account system: an account store, a Manage Accounts screen, an account switcher and a native manager that keeps each login in secure storage. For most users it is switched off. This plugin switches it on. It does not read, store or handle your tokens.

## What you get

- A **Switch accounts** area in Discord's own account management screen (tap your avatar on the You tab, then your avatar again where you edit your status).
- Add another account through Discord's normal login flow, then switch between accounts without logging out.
- Two optional commands you can type in any message box:
  - `/acct manage` opens the Manage Accounts modal.
  - `/acct sheet` opens the account action sheet.

## Install

1. Install [Unbound](https://github.com/marioparaschiv/unbound) on your iPhone (sideloaded IPA).
2. Copy this repo's `manifest.json` and `index.js` into a folder named `user.account-switcher` inside Unbound's plugins folder. On a sideloaded install this is visible in the Files app at **On My iPhone > Discord > Unbound > Plugins**.
3. Restart Discord and enable **Account Switcher** under Unbound's Plugins.

## How it works

The multi-account code is in Discord's iOS app but gated behind a single check, `MultiAccountStore.getCanUseMultiAccountMobile()`, which returns `false` for most accounts. On start, the plugin replaces that one method on the store instance so it returns `true`, then emits a change so the UI re-renders. Discord's own screens do the rest. On stop, the override is removed.

Do not try to switch accounts by calling `loginToken` or `switchAccountToken` yourself. Those skip the account-registration and session-restore machinery and can leave the app in a broken half-logged-in state that needs a reinstall.

## Compatibility

The `/acct` commands look up Discord's internal Metro modules by hardcoded id. Those ids are specific to the Unbound loader build this was written against (`loader-v353.0_119349`) and can change with any Discord or loader update. If an id no longer matches, the commands throw `module N not found - Discord build changed`. The startup unlock itself does not use those ids, only the store lookup, so it may keep working when the commands do not. Issues and PRs are welcome, particularly to look the modules up by export name instead of id.

## License

[MIT](LICENSE)
