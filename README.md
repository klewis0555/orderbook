This project was built using python version 3.11, pip version 23.0.1, and npm version 9.3.1.

## Setup
I have included a setup file that can handle the majority of the setup.
Alternatively, you can open `bin/setup.sh` and run those commands independently.
* In a terminal window (I use the Terminal app for Mac with zsh), navigate to the directory this **README** file is in (it should be called `order-book`).
    To make sure you are in the correct place, also in this **directory** should be the '**backend**', '**bin**', and 'frontend' directories.
* Once here, run `sh bin/setup.sh`. This should execute the setup steps for frontend dependencies and starting the backend virtual environment.
    Your terminal should now be in a virtual env called 'order-book'. When you are done running the project, you can run 'exit' to leave the virtual environment.
* In the virtual environment, run `pipenv install` to install the backend dependencies.

## Running the project
For this, you will need two terminal windows. The one you used for setup that should be in a virtual environment will be your backend server.
The other will be your frontend server.

* In the terminal with the virtual environment, run `python backend/manage.py migrate`.
* Then run `python backend/manage.py runserver`.
    This terminal should be running the backend server. You can press CTRL+C to stop it at any time. We can leave this terminal open for now.
* In a second terminal window, navigate to the `order-book/frontend` directory.
* In this directory run `npm start`.
    This should open up a window with the application running. If it doesn't, open a web browser page and navigate to 'http://localhost:3000/'.

And that should be it. You can press **CTRL+C** on both terminals to close the servers, and run `exit` to leave the virtual environment on the backend server.
