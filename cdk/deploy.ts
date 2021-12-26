const { execSync } = require('child_process')

const exec = (command: string) => execSync(command, { stdio: 'inherit' })

const env = process.argv[2]
if (env == null) {
  throw new Error('Environment param required (ex: node-ts deploy.ts staging)')
}
//  cdk deploy mathieu-ContainerStack --context env=mathieu
// container
const frontendPath = '../container'

// install
exec(`npm --prefix ${frontendPath} install`)

// build
exec(`npm run --prefix ${frontendPath} build`)

// deploy
exec(
  `cdk deploy ${env}-ContainerStack --context env=${env} --require-approval never `
)
