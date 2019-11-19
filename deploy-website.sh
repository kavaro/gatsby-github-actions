now=$(date '+y%Ym%md%dh%Hm%Ms%S')
commit_msg="No commit message"
tag_msg="No tag message"
data='{"event_type": "deploy-website", "client_payload": { "user_name": "kavaro", "user_email": "karl.van.rompaey@hotmail.com", "src_branch": "master", "dst_branch": "'$now'", "commit_msg": "'$commit_msg'", "tag": "V'$now'", "tag_msg": "'$tag_msg'" }}'

curl \
  -u kavaro:$KAVARO_GITHUB_TOKEN \
  -H "Accept: application/vnd.github.everest-preview+json" \
  -H "Content-Type: application/json" \
  -v POST \
  --data "$data" \
  "https://api.github.com/repos/kavaro/gatsby-github-actions/dispatches"
