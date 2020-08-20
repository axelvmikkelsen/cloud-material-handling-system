# Cloud Material Handling System

A [MERN](https://www.geeksforgeeks.org/mern-stack/) Stack application using [Pozyx](https://www.pozyx.io/ ) Indoor Positioning (MQTT) to automate material handling in a logistics environment. The user interface is a simple dashboard with some user functionality and mostly works as a "real-time" data display. Created as a summer job for the Logistics 4.0 Lab at NTNU.

## Table of Contents

* [Demo](#demo)
* [General info](#general-info)
* [Site](#site)
* [Pozyx](#Pozyx)
* [Built with](#built-with)

### Demo

___

Hosted on Heroku at https://cmhs-ntnu.herokuapp.com/. Login is required to show features. An `AWS EC2` instance for hosting this project exists, but is disabled because the project still is in the development phase. Heroku offers more compatibility with `git`.

### General info

___

#### Main Components

* Pozyx Tag - Real-time location received over MQTT from Pozyx.
  * Smart Objects (SO) - Movable object like a small/large box of items or pallet equipped with a Pozyx Tag.
  * Material Handling Module (MHM) - A handler can be an Automated-Guided-Vehicle (AGV), a forklift, or a manual operator with the ability to transport a Smart Object from destination A to destination B.

* Job - A job is generated with a start and end area, for example: **Workshop 1** to **Workshop 2**. When the `assignment engine` is active, the most suited MHM for the job is chosen automatically and the job is scheduled.

The dashboard retrieves data from the database through exposed URLs from the backend. The user has the ability to connect and disconnect to both the `mqtt`-stream and `assignment engine`.

#### Job allocation

At the moment, the best MHM candidates are found based on eucledian distance to the object. The idea is to continue implementing new features to improve the `assignment engine`.

### Site

___

#### Dashboard

![dash-cmhs](https://user-images.githubusercontent.com/52491186/90770223-bd59dc00-e2f1-11ea-9425-34b288af4a82.png)

#### Login

![login-cmhs](https://user-images.githubusercontent.com/52491186/90770154-a2876780-e2f1-11ea-91b0-b1f5a0054965.png)

#### Create new job

![job-cmhs](https://user-images.githubusercontent.com/52491186/90779686-6a3a5600-e2fe-11ea-9c7b-fbc79b384ee4.png)

#### Create new Tag

![tag-cmhs](https://user-images.githubusercontent.com/52491186/90779693-6b6b8300-e2fe-11ea-96fa-9071900394ba.png)

### Pozyx

___

The Indoor Positioning System is managed through [app.pozyx.io](app.pozyx.io). A layout is entered as a `.png` and the tags are shown live. The `mqtt`-stream sends a message/JSON-object to the CMHS every 10 seconds.

![pozyx-layout](https://user-images.githubusercontent.com/52491186/90779698-6c9cb000-e2fe-11ea-990f-aca0e3273509.png)

### Built with

___

* [MongoDB](https://www.mongodb.com/) - A general purpose NoSQL distributed database solution.
* [Express](https://expressjs.com/) - Web framework for Node.js.
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
* [Node.js](https://nodejs.org/en/) - An open-source JavaScript runtime environment.



