now=$(date '+y%Ym%md%dh%Hm%Ms%S')
commit_msg="No commit message"
tag_msg="No tag message"

curl \
  -u kavaro:$KAVARO_GITHUB_TOKEN \
  -v POST \
  -H "Accept: application/vnd.github.everest-preview+json" \
  -H "Content-Type: application/json" \
  --data '{"event_type": "deploy-website", "client_payload": { "branch": "'$now'", "commit_msg": "'$commit_msg'", "tag": "V'$now'", "tag_msg": "'$tag_msg'" }}' \
  "https://api.github.com/repos/kavaro/gatsby-github-actions/dispatches"
