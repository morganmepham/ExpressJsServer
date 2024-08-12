pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20' // Replace with the name of your NodeJS installation
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
                    // Add additional build steps if necessary
                }
            }
        }

        stage('Check Jenkins User') {
            steps {
                sh 'whoami'
                sh 'id'
            }
        }
        stage('Check Directory Permissions') {
            steps {
                sh 'sudo ls -ld /home /home/default_admin /home/default_admin/deploy /home/default_admin/deploy/server'
            }
        }
    

        stage('Adjust Permissions') {
            steps {
                sh 'sudo chmod -R 755 /home/default_admin/deploy'
                sh 'sudo chown -R jenkins:jenkins /home/default_admin/deploy'
            }
        }

        stage('Check Node Version') {
            steps {
                sh 'node --version'
            }
        }

        stage('Check Permissions - cert') {
            steps {
                sh 'sudo ls -ld /home/default_admin/certs/private.key'
                sh 'sudo ls -ld /home/default_admin/certs/certificate.crt'
            }
        }

        // stage('Restart Node') {
        //     steps {
        //         sh 'pkill node || true'
        //         sh 'nohup node /home/default_admin/deploy/server/server.js &'
        //     }
        // }

stage('Deploy to VM') {
    steps {
        sshagent(credentials: ['jenkins-ssh']) {
            // Deploy Frontend
            sh 'ssh -o StrictHostKeyChecking=no default_admin@192.168.0.40 "mkdir -p /home/default_admin/deploy/frontend_incoming"'
            sh 'scp -r frontend/dist/* default_admin@192.168.0.40:/home/default_admin/deploy/frontend_incoming/'
            sh 'ssh default_admin@192.168.0.40 "sudo /home/default_admin/deploy_frontend.sh"'

            // Deploy Server
            sh 'ssh default_admin@192.168.0.40 "mkdir -p /home/default_admin/deploy/server_incoming"'
            sh 'scp -r server/* default_admin@192.168.0.40:/home/default_admin/deploy/server_incoming/'
            sh 'ssh default_admin@192.168.0.40 "sudo /home/default_admin/deploy_server.sh"'

            // Restart Server
            sh 'ssh default_admin@192.168.0.40 "pm2 restart server || pm2 start /home/default_admin/deploy/server/server.js --name server"'
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
