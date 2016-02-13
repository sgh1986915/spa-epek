# SPA

Installing Local Env
====================

clone the SPA repo
git clone https://<yourname>@bitbucket.org/epekltd/spa.git

install the dependencies
cd spa
npm install

You also need the grunt command-line
npm install -g grunt-cli
And karma
npm install -g karma


Running Local Env
=================

Map local.epek.com to 127.0.0.1 via a hosts entry. Example for Linux/Unix systems:

		# epek
		127.0.0.1 local.epek.com

to start the server:
node scripts/server.js

and visit the app:
http://local.epek.com/index.html.
http://local.epek.com/#/sell/video
http://local.epek.com/#/sso/register

Depending on the operating systems you might need root rights to use port 80. In this case you can use "sudo node scripts/server.js". Running the webserver on local.epek.com and port 80 is needed to have it work with the API (see CORS for more information).
In case you do not want to run the server with these priviledges, you can enable nodejs to use lower port numbers:
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/nodejs


Installing sass & compass
=========================

to compile the SPA css/style.css you need sass and compass

Installing ruby
sudo apt-get install ruby-full build-essential

Installing rubygems
sudo apt-get install rubygems

Install sass & compass
sudo gem install sass compass
sudo gem install susy
sudo gem install font-icons --pre

check if sass is working
sass -v


Build SPA app
=============

build the SPA app into dist folder
grunt 

Development Server
==================

- `grunt server` will spawn a server and watches html,js,sass files for
modifications, reloading the pages for js,html updates and compiling/updating css in the browser for .sass updates. 


Running Specs
=============

grunt karma:unit
