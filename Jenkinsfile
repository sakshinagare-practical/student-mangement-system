pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Project Information') {
            steps {
                sh '''
                    echo "===================================="
                    echo "Student Management System"
                    echo "===================================="

                    echo "Git commit:"
                    git rev-parse --short HEAD

                    echo "Files:"
                    ls -la
                '''
            }
        }

        stage('Validate Files') {
            steps {
                sh '''
                    test -f index.html
                    test -f style.css
                    test -f script.js

                    echo "All required project files exist."
                '''
            }
        }

        stage('Validate JavaScript') {
            steps {
                sh '''
                    if command -v node >/dev/null 2>&1; then
                        node --check script.js
                        echo "JavaScript syntax check passed."
                    else
                        echo "Node.js is not installed."
                        echo "Skipping JavaScript syntax check."
                    fi
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    rm -rf build
                    mkdir -p build

                    cp index.html build/
                    cp style.css build/
                    cp script.js build/

                    echo "Application packaged successfully."
                    ls -la build/
                '''
            }
        }

        stage('Test Build') {
            steps {
                sh '''
                    test -f build/index.html
                    test -f build/style.css
                    test -f build/script.js

                    echo "Build verification successful."
                '''
            }
        }
    }

    post {
        success {
            echo '===================================='
            echo 'CI PIPELINE SUCCESS'
            echo '===================================='
        }

        failure {
            echo '===================================='
            echo 'CI PIPELINE FAILED'
            echo 'Check the Console Output.'
            echo '===================================='
        }

        always {
            archiveArtifacts artifacts: 'build/**',
                             allowEmptyArchive: true
        }
    }
}
