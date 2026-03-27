Create 2 EC2 Instance for Jenkins(CI/CD, Docker) and Prometheus(Monitoring) Server

In Jenkins EC2 Instance
1. Install Java & Jenkins
```sh
sudo apt install openjdk-21-jdk -y

sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update -y
sudo apt-get install jenkins -y
```

2. Install Docker
```sh
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER
sudo usermod -aG docker jenkins
```

3. Login to Docker on EC2 Instance

4. Install Trivy
```sh
sudo apt-get install wget gnupg
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

5. Install AWS CLI
```sh
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then 
    AWS_ARCH="x86_64"
elif [ "$ARCH" = "aarch64" ]; then 
    AWS_ARCH="aarch64"
fi

curl "https://awscli.amazonaws.com/awscli-exe-linux-${AWS_ARCH}.zip" -o "awscliv2.zip"
sudo apt-get install -y unzip
unzip awscliv2.zip
sudo ./aws/install --update
rm -rf aws awscliv2.zip
```

6. Run SonarQube Scanner using Docker
```sh
docker run -d --name sonarqube \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_logs:/opt/sonarqube/logs \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  sonarqube:26.2.0.119303-community
```

7. Create IAM User with Policies
    1. AmazonEC2FullAccess
    2. IAMFullAccess
    3. AmazonEKS_CNI_Policy
    4. AmazonEKSClusterPolicy
    5. AmazonEKSWorkerNodePolicy
    6. AmazonCloudFormationFullAccess

8. Add an inline policy of EKSFullAccess
 ```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EKSFullAccess",
            "Effect": "Allow",
            "Action": [
                "eks:*"
            ],
            "Resource": "*"
        }
    ]
}
```

9. Create Access Key and Secret Key for the IAM User

10. Configure AWS CLI on EC2 Instance
```sh
aws configure
```

11. Install Jenkins Plugins
    a. Docker, Docker Commons, Docker API
    b. Pipeline Stage View
    c. NodeJS
    d. SonarQube Scanner
    e. Kubernetes, Kubernetes CLI, Kubernetes Client API, Kubernetes Credentials, Kubernetes Credentials Provider
    f. OWASP Dependency-Check
    g. Prometheus Metrics
    h. Email Extension Template

12. Install amazon kubectl and eksctl
```sh
curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.35.2/2026-02-27/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --client


curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin/
```

13. Create EKS Cluster
```sh
eksctl create cluster --name bmsEks --region ap-south-1 --zones ap-south-1a,ap-south-1b --version 1.35 --without-nodegroup
```

14. Create and Add Sonarqube Token in Jenkins
credentials ->
sonar-token 
docker-creds 
email-creds 
tools name ->
node24
dependency-check
docker
sonar-server
sonar-scanner

15. Enable OIDC
```sh
eksctl utils associate-iam-oidc-provider --region ap-south-1 --cluster bmsEks --approve
```

16. Create Nodegroup
```sh
eksctl create nodegroup --cluster bmsEks --region ap-south-1 --name bmsNodes --node-type c7i-flex.large --nodes 3 --nodes-min 2 --nodes-max 4 --node-volume-size 20 --ssh-access --ssh-public-key admin --managed --asg-access --external-dns-access --full-ecr-access --appmesh-access --alb-ingress-access
```

17. In System Configuration in Jenkins Manage Jenkins -> Configure System
Go to Extended Email Notification and check the box Enable Extended Email Notification
Add the SMTP server details -> smtp.gmail.com
Add the SMTP port -> 465
then Click on Advanced
Select the Credentials -> email-creds
Check the SSL and OAuth
Set the Default Content Type -> HTML (text/html)

Scroll down and Set the Same for Email Notification
Add the SMTP server details -> smtp.gmail.com
then Click on Advanced
Check the SMTP Authentication add the 
username -> [EMAIL_ADDRESS]
password -> [PASSWORD]
Check the SSL
Add the SMTP port -> 465
set the Reply-To Address -> [EMAIL_ADDRESS]
then Test the Configuration Email by providing the email address you want to send the email to -> [EMAIL_ADDRESS]

Set the Sonar Server Configuration
Click the Add SonarQube Server button
Add the Server URL -> http://<EC2_IP_ADDRESS>:9000
Add the Server Name -> sonar-server
Add the Server Token -> select the sonar-token from the dropdown

18. Create the Pipeline Job for BMS
Set the Pipeline script from the SCM

19. Docker Deployment Steps for Staging
Select the Jenkinsfile1 from the SCM

20. Kubernetes Deployment Steps for Production
Select the Jenkinsfile2 from the SCM

For Kubernetes Deployment We need to Configure the AWS Credentials in Jenkins User
// To check if jenkins is running by which user
```sh
ps aux | grep 'jenkins'
```
// Now we have to configure aws credentials in jenkins

```sh
sudo -su jenkins
aws configure
```

```sh
# To check the aws credentials by which aws user
aws sts get-caller-identity
```
Update the kubeconfig file
```sh
aws eks update-kubeconfig --region ap-south-1 --name bmsEks
```
Then Run the Pipeline Job for Kubernetes Deployment of BMS

In Monitoring EC2 Instance

21. Install Prometheus
```sh
# Create Prometheus system user
sudo useradd --system --no-create-home --shell /bin/false prometheus

# Create directories
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus

# Download Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz

# Extract and move files
tar xvf prometheus-*.tar.gz
cd prometheus-*/
sudo mv prometheus /usr/local/bin/
sudo mv promtool /usr/local/bin/
sudo mv consoles/ /etc/prometheus
sudo mv console_libraries/ /etc/prometheus
sudo mv prometheus.yml /etc/prometheus

# Create systemd service
sudo tee /etc/systemd/system/prometheus.service << EOF
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
User=prometheus
Group=prometheus
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries \
  --web.listen-address=0.0.0.0:9090 \
  --web.enable-lifecycle

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
sudo chown -R prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /var/lib/prometheus

# Start Prometheus
sudo systemctl daemon-reload
sudo systemctl start prometheus
sudo systemctl enable prometheus
```

22. Install Node Exporter

```sh
sudo useradd --system --no-create-home --shell /bin/false node_exporter

wget https://github.com/prometheus/node_exporter/releases/download/v1.6.0/node_exporter-1.6.0.linux-amd64.tar.gz
tar xvf node*exporter-*.tar.gz
sudo mv node*exporter-*/node_exporter /usr/local/bin
rm -rf node_exporter*
```
 Create systemd service for Node Exporter

```sh
sudo tee /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
User=node_exporter
Group=node_exporter
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/node_exporter --collector.logind

[Install]
WantedBy=multi-user.target
EOF
```

Start Node Exporter

```sh
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl enable node_exporter
```

Update the /etc/prometheus/prometheus.yml file
```sh
sudo vi /etc/prometheus/prometheus.yml
```

```yaml
  - job_name: "node_exporter"
    static_configs:
      - targets: ["<Monitoring_EC2_IP_ADDRESS>:9100"]

  - job_name: "jenkins"
    metrics_path: "/prometheus"
    static_configs:
      - targets: ["<Jenkins_EC2_IP_ADDRESS>:8080"]
```

To check the prometheus config is valid
```sh
promtool check config /etc/prometheus/prometheus.yml
```

To reload the prometheus config
```sh
curl -X POST http://localhost:9090/-/reload
```

23. Install Grafana
```sh
sudo apt-get install -y software-properties-common
wget -q -O - https://apt.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

sudo apt-get update
sudo apt-get install grafana -y

sudo systemctl daemon-reload
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

Set the Prometheus as Data Source in Grafana

Add the 9964 dashboard in Grafana for Jenkins Performance Monitoring
Add the 1860 dashboard in Grafana for Node Exporter Monitoring

And If you want to Delete the EKS Cluster and Nodegroup
```sh
eksctl delete nodegroup --cluster bmsEks --region ap-south-1 --name bmsNodes
eksctl delete cluster --name bmsEks --region ap-south-1
```