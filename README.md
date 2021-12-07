# E14ACNND3
Harvard Extension School | E14A CNN + D3

# Hosted Site
https://gazeintent.herokuapp.com/

# Setup
1. pyenv app
2. source app/bin/activate
3. cd app
4. pip install -r requirements.txt
5. cd static && npm i webgazer --save && cd ../
6. export SLACK_WEBHOOK_URL=$(heroku config:get SLACK_WEBHOOK_URL -a gazeintent)
7. export DATABASE_URL=$(heroku config:get DATABASE_URL -a gazeintent)
8. export SECRET_KEY=$(heroku config:get SECRET_KEY -a gazeintent)
9. python routes.py

# Heroku
1. You will need access to the gazeintent project in order to run this on your localhost

# Components
1. Webgazer: This is the backbone of the application, we used many of its features to make our application work.
2. Frameworks: We leveraged bootstrap, fontawesome, datatables, and other small components from online sources.
3. Custom: We wrote 98% of the javascript used in the project, what was not written by us was common stuff like the sleep function, or packaged code like init.datatables, or init.webgazer
4. Theme: We used frameworks to provide the basic design, but we put all of the pages together. 
5. Data visualization: Custom solution written in javascript and css. 
