# Deployment

Quick and dirty deployment guide.

## Extension

From `extension`,

1. Run `npm install -g @vscode/vsce`
2. Get a personal access token, following [this](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) guide
    - The account is under "mdemarco88 \[at\] outlook \[dot\] com" (TODO: migrate to personal email)
3. Run `vsce login michaelfromyeg`; paste the token
4. Run `vsce publish`

## Server

1. Set up the project on [Railway](https://railway.app); `nix` does the heavy lifting
   1. Ensure the target folder is `server`
2. Push to `main`
