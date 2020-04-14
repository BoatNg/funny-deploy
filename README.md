# deploy-action

deploy your project to the server via ssh password

## env

> the parameter of env reference [node-ssh](https://github.com/steelbrain/node-ssh#readme)

* REMOTE_HOST [required]
  * server's host. example `127.0.0.1`
  
* REMOTE_PORT
  * port of ssh listening in server side. default 22

* REMOTE_USER [required]
  * sensitive information, you should creating and storing encrypted secrets in github. [how](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)
  
* REMOTE_PASSWORD [required]
  * as `REMOTE_USER`

* REMOTE_PATH [required]
  * the path where project deployed in server. it should be a absolute path. example: `/home/wwww/project-name`

* SOURCE
  * the directory which you want to deploying, it under the [GITHUB_WORKSPACE](https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables). example: `dist/`. it's default value is `""`.

* example
  ```yml
  on: [push]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      name: deploy test
      steps:
      - name: checkout

      - name: deploy dist
        id: funny-deploy
        uses: BoatNg/funny-deploy@master
        env:
          REMOTE_HOST: "${{ secrets.REMOTE_HOST }}"
          REMOTE_USER: "${{ secrets.REMOTE_USER }}"
          REMOTE_PASSWORD: "${{ secrets.REMOTE_PASSWORD }}"
          REMOTE_PATH: "/home/www/deploy-action"
          SOURCE: "dist/"

  ```