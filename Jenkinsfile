pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'git@github.com:morganmepham/ExpressJsServer.git', credentialsId: '1'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                // Add build commands here
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                // Add test commands here
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Add deployment commands here
            }
        }
    }
}
