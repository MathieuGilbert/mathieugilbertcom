const { execSync } = require('child_process')

const env = process.argv[2]
if (env == null) {
  throw new Error('Environment param required (ex: node-ts deploy.ts staging)')
}

const exec = (command: string) => execSync(command, { stdio: 'inherit' })

const install = (frontendPath: string) =>
  exec(`npm --prefix ${frontendPath} install`)

const build = (frontendPath: string) =>
  exec(`npm --prefix ${frontendPath} run build`)

const deploy = (stackName: string) =>
  exec(
    `cdk deploy ${env}-${stackName} --context env=${env} --require-approval never --outputs-file outputs.json`
  )

// install
install('../web')

// build
build('../web')

// deploy
deploy('HometownStack')
