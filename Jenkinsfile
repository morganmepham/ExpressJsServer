pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: '${env.GIT_BRANCH}', url: 'git@github.com:your-username/your-repo.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Docker Build and Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker build -t your-app-name .'
                sh 'docker stop your-app-name || true'
                sh 'docker rm your-app-name || true'
                sh 'docker run -d --name your-app-name -p 3000:3000 your-app-name'
            }
        }
    }
}