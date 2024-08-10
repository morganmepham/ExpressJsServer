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

                scp -r frontend/dist default_admin@192.168.0.40:${FRONTEND_DEPLOY_PATH}
                scp -r server default_admin@192.168.0.40:${SERVER_DEPLOY_PATH}

                ssh default_admin@192.168.0.40 '
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
