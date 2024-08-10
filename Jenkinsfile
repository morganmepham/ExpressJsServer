pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository
                git url: 'git@github.com:morganmepham/ExpressJsServer.git', branch: 'main', credentialsId: '1'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    // Navigate to the frontend directory and install dependencies
                    sh 'npm install'
                    // Build the frontend
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('server') {
                    // Navigate to the server directory and install dependencies
                    sh 'npm install'
                    // If there's a build step for the backend, add it here
                    // For example: sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                // Copy built files to the VM and start the server
                sh '''
                # Define deployment paths
                FRONTEND_DEPLOY_PATH=/home/default_admin/deploy/frontend
                SERVER_DEPLOY_PATH=/home/default_admin/deploy/server

                # Copy frontend build to the VM
                scp -r frontend/dist user@vm_ip:${FRONTEND_DEPLOY_PATH}

                # Copy server files to the VM
                scp -r server user@vm_ip:${SERVER_DEPLOY_PATH}

                # SSH into the VM and start the server
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
            // Clean up workspace
            cleanWs()
        }
    }
}
