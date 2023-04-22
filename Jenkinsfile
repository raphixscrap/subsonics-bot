pipeline {
    agent any

    stages {
        stage('[Subsonics] - Test') {
            steps {
                script {
                    echo "[Subsonics-Deploy] - Test Stage"
                    sh "rm -rf subsonics"
                    sh "git clone https://git.raphix.fr/raphix/subsonics.git"
                    sh "cd subsonics"
                    sh "npm i"
                    sh "ENV='TEST' node bin/www"
                }
                
            }
        }
        stage('[Subsonics] - Déploiement') {
            steps {
                script {
        
                    def doesJavaRock = input(message: 'Confirmation de Déploiement', ok: 'Déployer')
                    echo "[Subsonics-Deploy] - Deploy Stage"
                    sh "ssh raphix@raphix.fr sudo apt update -y"
                    sh "ssh raphix@raphix.fr sudo apt upgrade -y"
                    sh "ssh raphix@raphix.fr sudo -S -u gitlab-ci /home/gitlab-ci/subsonics_deploy.sh"
                   
                              
                }
                
            }
        }
    }
}