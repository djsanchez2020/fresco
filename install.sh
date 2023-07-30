sudo apt-get remove node -y;
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -;
sudo apt-get update -y;
sudo apt-get install -y nodejs;
cd angular;
sudo npm install -y;
cd ../django;
sudo apt-get install libpq-dev python3-dev -y; 
pip3 install --user -r requirements.txt