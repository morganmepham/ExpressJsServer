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

        // stage('Build Frontend') {
        //     steps {
        //         dir('frontend') {
        //             sh 'npm install'
        //             sh 'npm run build'
        //         }
        //     }
        // }

        // stage('Build Backend') {
        //     steps {
        //         dir('server') {
        //             sh 'npm install'
        //             // Add additional build steps if necessary
        //         }
        //     }
        // }

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
                sh 'ls -l /home/default_admin/certs/private.key'
                sh 'ls -l /home/default_admin/certs/certificate.crt'
            }
        }

        stage('Restart Node') {
            steps {
                sh 'pkill node || true'
                sh 'nohup node /home/default_admin/deploy/server/server.js &'
            }
        }

         stage('Build and Deploy') {
            steps {
                script {
                    def frontendDeployPath = '/home/default_admin/deploy/frontend'
                    def serverDeployPath = '/home/default_admin/deploy/server'
                    def vmIp = '192.168.0.40'
                    def user = 'default_admin'
                    def sshKey = '/var/lib/jenkins/.ssh/jenkins_ssh'

                    sh """
                    scp -i ${sshKey} -o StrictHostKeyChecking=no -r frontend/dist ${user}@${vmIp}:${frontendDeployPath}
                    scp -i ${sshKey} -o StrictHostKeyChecking=no -r server ${user}@${vmIp}:${serverDeployPath}
                    ssh -i ${sshKey} -o StrictHostKeyChecking=no ${user}@${vmIp} '
                        cd ${serverDeployPath} &&
                        npm install &&
                        npm start
                    '
                    """
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
