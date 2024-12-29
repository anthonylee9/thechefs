We did not seed the database, so once you get the website up and running using the instructions below, make sure to make multiple users and switch between them to test the website's full functionality.


To run, first install docker and Visual Studio Code. Add the docker plugin to visual studio code. If docker is not working as expected you can install mariadb or mysql directly using their respective installers. Please make sure it's version 5.7 for mysql not 8.0 as 8.0 has some password encryption that doesn't work with our mysql plugin from node. 

1. Using the docker plugin, right click ont he docker-compose.yml file and perform a "Compose Up".
2. Then in the docker tab, attach a shell. 
3. log in to the database "mysql -uroot -p" enter "password"
4. run the following command: "create database test;"
5. exit out of the shell. 
6. Navigate to api directory
7. npm install
8. copy the ormconfig.json.example to ormconfig.json and modify the file to match your setup, primarily make sure username and password are correct for the database connection. 
9. npm run serve
10. In another terminal navigate to the webapp2 directory
11. npm install
12. npm run dev
13. Navigate to url displayed in the terminal to see if the application is running. 

