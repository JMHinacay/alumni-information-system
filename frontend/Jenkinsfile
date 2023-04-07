#!/usr/bin/env groovy


node {
        def WORKSPACE = pwd()
        env.KUBECONFIG = pwd() + "/.kubeconfig"
}



pipeline {


    agent {
        label 'docker-slave'
    }



    stages {


        stage('Checkout') {

            steps {
                script {
                    checkout scm
                }
            }


        }
        //=================

        stage('Checking Environment') {

                    steps {

                            sh """
                                java -version
                                gradle -version
                                npm -version
                                node --version
                                mvn help:evaluate -Dexpression=settings.localRepository 
                               """
                    }

          }



         stage('Create  Image Builder') {
                        when {
                            expression {
                                openshift.withCluster() {
                                    openshift.withProject() {
                                        return !openshift.selector("bc", "hisd3mk2hr").exists();
                                    }
                                }
                            }
                        }
                        steps {
                            script {
                                openshift.withCluster() {
                                    openshift.withProject() {
                                        openshift.newBuild("--name=hisd3mk2hr","--binary=true")
                                    }
                                }
                            }
                        }
          }



          stage("Build To Prod") {


            steps {
                    login()


                    sh """
                        oc start-build hisd3mk2hr --from-dir=./hrpayroll
                    """

            }

         }
        //=======================




    }


}


def login() {
}

def processStageResult() {

    if (currentBuild.result != null) {
        sh "exit 1"
    }
}
