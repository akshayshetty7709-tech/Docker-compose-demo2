pipeline {
agent any

environment {
        // Harbor Details
        HARBOR_REGISTRY = "3.108.5.155" // Replace with your Harbor URL
        HARBOR_PROJECT  = "compose"            // Replace with your Harbor Project name
        
        
        // Full Harbor Repo Path
        HARBOR_REPO     = "${HARBOR_REGISTRY}/${HARBOR_PROJECT}"
        
        // SonarScanner Tool
        SCANNER_HOME    = tool 'SonarScanner'
    }
stages {
stage ('1.checkout') {
steps {
git branch: 'main', url: 'https://github.com/akshayshetty7709-tech/Docker-compose-demo2.git'
}
}
 stage('2.SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=Docker-compose-demo2 \
                    -Dsonar.sources=.
                    """
                }
            }
        }

 stage('3.Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('4.Login to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-credentials', 
                                                 passwordVariable: 'HARBOR_PW', 
                                                 usernameVariable: 'HARBOR_USER')]) {
                    // Use single quotes (''') to avoid syntax and masking warnings
                    sh '''
                    echo "$HARBOR_PW" | docker login 3.108.5.155  -u "$HARBOR_USER" --password-stdin
                    '''
                }
            }
        }
stage ('5.build') {
steps {
sh """
echo "=== DEBUG ==="
echo "HARBOR_REGISTRY=[$HARBOR_REGISTRY]"
echo "HARBOR_PROJECT=[$HARBOR_PROJECT]"
docker compose config
echo "=== END DEBUG ==="
docker compose up --build -d 
docker compose push
"""
}
}
}
}

