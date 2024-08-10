pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url'git@github.com:morganmepham/ExpressJsServer.git',
                credentialsId "1"
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build Frontend') {
            steps {
                sh 'npm run build --prefix frontend'
            }
        }
        stage('Build Backend') {
            steps {
                sh 'npm run build --prefix backend'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'pm2 restart server.js'
            }
        }
    }
}
