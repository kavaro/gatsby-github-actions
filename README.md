How to setup deploy-website github actions
1. create repository
2. create or re-use existing personal access token (required for triggering the deploy-website workflow)
  - to create personal access token:
    - goto account (right top)
    - click settings
    - click developer settings
    - click personal access token
    - create access token and copy the token to a safe place
  - see ./deploy-website.sh script to see how person access toke (KAVARO_GITHUB_TOKEN) is used in curl
3. create firebase access token
  - firebase ci
  - copy token
  - goto repo
    - settings
    - create secret with the name FIREBASE_TOKEN
4. In repo source create .github/workflows directory with deploy-website.yml file
  - this workflow will
    - checkout repository
    - install nodejs
    - install firebase-tools
    - yarn install
    - yarn build
    - firebase deploy
5. test workflow by running ./deploy-website.sh script

git as database (prefered)
--------------------------
- admin:
  - take JSON snapshot of database and deflate with https://github.com/nodeca/pako
  - upload JSON to firebase storage
  - create firestore publish document with reference to firebase storage ref
  - foreach firestore publish doc older then 1 year 
    - remove doc from firestore
- firebase function triggered when publish document is created
  - trigger github build passing the ref path of the file uploaded to firebase storage
- firebase function triggered when publish document is removed
  - remove doc.snapshot from firebase storage
- github
  - download and deflate firebase storage snapshot
  - yarn build (gatsby sources db directory)
  - git config --local user.email "karl.van.rompaey@hotmail.com"
  - git config --local user.name "kavaro"
  - git checkout -b ${{ github.event.client_payload.branch }}
  - save snapshot json collections/documents into directories/files under db directory
  - remove snapshot json file
  - remove all db directories/files that are not in snapshot
  - git add .
  - git commit -m "${{ github.event.client_payload.commit_msg }}"
  - git tag -a "${{ github.event.client_payload.tag }}" -m "${{ github.event.client_payload.tag_msg }}"
  - git push origin ${{ github.event.client_payload.branch }}
  - git push origin ${{ github.event.client_payload.tag }}

firebase storage with snapshots
-------------------------------

- client adds release document to firestore
  - firebase function 
    - uploads json with all database documents to firebase storage
    - triggers github action passing the url of the uploaded database json
  - github actions
    - downloads the json from firebase storage 
    - adds url to firebase storage to 





