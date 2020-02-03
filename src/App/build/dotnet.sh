#!/usr/bin/env bash

wget -q packages-microsoft-prod.deb https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb

sudo apt-get install apt-transport-https -y
sudo apt-get update -y
sudo apt-get install dotnet-sdk-2.2 -y

dotnet --version