Idea:
- use octokit to commit database files to github
- then trigger 

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
  - create firestore deployments document with 
    - branch: string
    - commit_msg: string
    - tag: string
    - tag_msg: string
  - firebase function triggered by "deployments document created" event
    - trigger github action with client_payload = deployment document
- github:
  - get firestore deployment document
    - update status = 'Cloning database'
  - get all documents from firestore and save as json files
  - update status = 'buiding'
  - yarn build (gatsby sources db directory)
  - git config --local user.email "karl.van.rompaey@hotmail.com"
  - git config --local user.name "kavaro"
  - git checkout -b ${{ github.event.client_payload.branch }}
  - save snapshot json collections/documents into directories/files under db directory
  - remove all db directories/files that are not in snapshot
  - git add .
  - git commit -m "${{ github.event.client_payload.commit_msg }}"
  - git tag -a "${{ github.event.client_payload.tag }}" -m "${{ github.event.client_payload.tag_msg }}"
  - git push origin ${{ github.event.client_payload.branch }}
  - git push origin ${{ github.event.client_payload.tag }}

- Client
  Create snapshot
  Create firestore doc with status = 'uploading'
  Upload snapshot of database to storage under firestore snapshots/docId
    Once the upload has been performed, the user can continue to work while the release is deployed in the background
  Update firestore deploy doc status = 'uploaded'
- Firebase function on firestore deploy doc create and update events
        start github deploy_website workflow

- Github deploy_website workflow
  - Update firestore deploy doc status = 'building'
  - read firestore deploy collection
  - create branch
  - download snapshot with docId
  - gatsby build
  - commit
  - tag
  - Update firestore deploy doc status = 'build'
  - acquire deploy mutex
  - if (deploy mutex is acquired)
      while (most recent deploy doc has status === 'build')
        try {
          doc.status = 'deploying'
          checkout correct branch
          deploy
          doc.status = 'deployed'
        } catch(err) {
          doc.status = 'error'
          doc.error = err
        } finally {
          release deploy mutex
        }



