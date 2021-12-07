# GazeIntent

## Project Plan

**Meeting Times**: Monday, Wednesday 7:00 - 8:00PM EST (1 hour)

**Zoom Link**: https://harvard.zoom.us/j/82654004922?pwd=bXE3SVo0L1lFajhLdmpTNld6MXlVUT09

**Github Repo**: https://github.com/mpbunch/E14ACNND3.git

**Website Design Template**: Bootstrap

**Website Location**: https://gazeintent.herokuapp.com/ 

### Team Members

Yihan Zhou - zhanonly@gmail.com
Michael Lintott - mil623@g.harvard.edu
Matt Bunch - mattbunch@gmail.com

## Project Basics

The purpose of this project is to determine intent of gaze. Specifically, the intent of gaze while viewing a screen. We believe we can determine if someone is actively looking at a screen, for how long, as well as collect other bio/demo data about the user.

The project will be implemented using the following technologies: Python, Flask, and a Convolutional Neural Network

As an initial proof of concept, we will observe users through a web application with webcam support. The webcam data will be sent to a server where the data is passed through a CNN, features will be analyzed, and spit out for rendering. This returned metadata will be rendered within the web application to prove that we are able to accurately classify and represent the users gaze.

This foundational technology could be used within many industries:
1. Advertising, how valuable is my ad space actually worth
2. Security, airlines, are people paying attention to the flight attendants
3. Enhanced web interface controls, allowing for non-motor individuals to control and interact with the web

Dataset:
Webgazer

## Project Structure

/app/				    - The folder containing the app
/app/route.py		- The main app entry point
/app/models.py  - Application database models
/app/forms.py   - Application forms
/app/templates	- Where the templates live
/app/static			- Static files, etc

./requirements.txt - Python application dependencies


The main components of the app are:

1. **Base** - The main website, where we will demonstrate the gaze intent product offering.

2. **Webgazer** - Webgazer is at the heart of our project, it is a javascript implementation that enables eye location detection.

3. **Heroku** - Heroku is the platform from which our application will be served.

4. **Custom Scripting** - Custom javascript will be written to preform all of the support functions to bring enable webgazer to preform our specific function.

## Project Timeline

1. Milestone 1: Determine the dataset

2. Milestone 2: Document the functions and inner workings of the application

3. Milestone 3: Setup application hosting

4. Milestone 4: Implement webgazer

5. Milestone 5: Implement a calibration function

6. Milestone 6: Implement the test function

7. Milestone 7: Implement the data visualization 

8. Milestone 8: Cleanup project codebase, create presentation assets.
