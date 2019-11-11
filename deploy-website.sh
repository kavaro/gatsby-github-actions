curl \
  -u kavaro:$KAVARO_GITHUB_TOKEN \
  -v POST \
  -H "Accept: application/vnd.github.everest-preview+json" \
  -H "Content-Type: application/json" \
  --data '{"event_type": "deploy-website"}' \
  "https://api.github.com/repos/kavaro/gatsby-github-actions/dispatches"
