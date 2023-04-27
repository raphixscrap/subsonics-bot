pipeline {
    agent any

    stages {
        stage('[Subsonics] - Test') {
            steps {
                script {
                    echo "[Subsonics-Deploy] - Test Stage"
                    sh "rm -rf bot"
                    sh "git clone https://git.raphix.fr/subsonics/bot.git"
                    sh "cd bot"
                    sh "npm i"
                    sh "ENV='TEST' node src/main.js"
                }
                
            }
        }
        stage('[Subsonics] - Déploiement') {
            steps {
                script {
    
                    echo "[Subsonics-Deploy] - Deploy Stage"
                    sh "ssh raphix@raphix.fr sudo apt update -y"
                    sh "ssh raphix@raphix.fr sudo apt upgrade -y"
                    sh "ssh raphix@raphix.fr sudo -S -u gitlab-ci /home/gitlab-ci/subsonics_deploy.sh"
                   
                              
                }
                
            }
        }
    }
}