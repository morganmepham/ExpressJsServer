pipeline {
    agent any

    tools {
        nodejs 'NodeJS-14' // Ensure this matches the NodeJS installation on your Jenkins
    }

    stages {
        stage('Cleanup') {
            steps {
                sh 'rm -rf *'
            }
        }

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
                }
            }
        }

        stage('Deploy to Raspberry Pi') {
            steps {
                sshagent(credentials: ['pi-ssh-key']) { // Make sure to add your Pi's SSH key to Jenkins credentials
                    // Deploy Frontend
                    sh 'ssh -o StrictHostKeyChecking=no pi@raspberrypi.local "mkdir -p /home/pi/deploy/frontend"'
                    sh 'scp -r frontend/dist/* pi@raspberrypi.local:/home/pi/deploy/frontend/'

                    // Deploy Server
                    sh 'ssh pi@raspberrypi.local "mkdir -p /home/pi/deploy/server"'
                    sh 'scp -r server/* pi@raspberrypi.local:/home/pi/deploy/server/'

                    // Install dependencies on Raspberry Pi
                    sh 'ssh pi@raspberrypi.local "cd /home/pi/deploy/server && npm install"'

                    // Restart Server using PM2
                    sh 'ssh pi@raspberrypi.local "pm2 restart server || pm2 start /home/pi/deploy/server/server.js --name server"'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}