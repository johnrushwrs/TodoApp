# basic-todo
A basic todo service written in ASP.NETCore

# getting started
To run the server, navigate to the /src/todoApi folder.
1. Run `docker compose build` to build the set of container images that will run the backend server.
2. Run `docker compose up` to start the server
3. If it is the first time you are running the server, run the database migrations with `dotnet ef database update` to create the initial tables.

# debugging and testing
Currently there is not a UI server that is serving the static page content. You can use the VSCode extension "Live Server" to view the various html pages and test them.