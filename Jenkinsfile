pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20' // Replace with the name of your NodeJS installation
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'git@github.com:morganmepham/ExpressJsServer.git', branch: 'main', credentialsId: '1'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('server') {
                    sh 'npm install'
                    // Add additional build steps if necessary
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                FRONTEND_DEPLOY_PATH=/home/default_admin/deploy/frontend
                SERVER_DEPLOY_PATH=/home/default_admin/deploy/server

                scp -r frontend/dist user@vm_ip:${FRONTEND_DEPLOY_PATH}
                scp -r server user@vm_ip:${SERVER_DEPLOY_PATH}

                ssh user@vm_ip '
                    cd ${SERVER_DEPLOY_PATH} &&
                    npm install &&
                    npm start
                '
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
