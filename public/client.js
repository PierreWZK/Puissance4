// Déclariation de variable
let username = prompt("Votre nom :");

let firstPlayer;
let secondPlayer;

var socket = io();
let PlayerTurn = 1;
let won = false;

var plateau = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];


// Permet la création du tableau html 
var body = document.getElementsByTagName("body")[0];
var tbl = document.createElement("table");
var tblBody = document.createElement("tbody");

for (var i = 0; i < 6; i++) {
    // Crée des lignes avec une certaine id
    var row = document.createElement("tr");
    row.setAttribute("id", i + 1);

    for (var j = 0; j < 7; j++) {
        // Crée des cases avec une certaines id
        let cell = document.createElement("td");
        // Création d'un bouton qui permetra un placement de couleur à l'emplacement
        let btn = document.createElement("BUTTON");

        //Permet de donner un id a chaque td. 
        let tempi = i.toString();
        let tempJ = j.toString();
        let newvar = tempi.concat(tempJ)
        cell.setAttribute("id", newvar);

        let cellText = document.createTextNode(" ");
        let emplacementBouton = newvar % 10 + 1;

        // Quand le bouton est cliquer il envoie au serveur l'emplacement de la case qui doit changer
        btn.onclick = function() {
            if (won == false) {
                socket.emit('placerUneCouleur', emplacementBouton)
            }
        };

        cell.appendChild(cellText);
        // Permet l'ajout du bouton dans chaque case 
        cell.appendChild(btn);

        row.appendChild(cell);
    }

    tblBody.appendChild(row);
}

tbl.appendChild(tblBody);
body.appendChild(tbl);
tbl.setAttribute("border", "2");


// Permet le changement de couleur sur les case 

$("td button").hover(function() {
    $(this).css("background-color", "rgba(255, 0, 0, .1)");
}, function() {
    $(this).css("background-color", "inherit");
});



$(function() {
    // Permet de refresh update le tableau si un spectateur join. Sinon il n'a pas les modifications de couleurs en cours
    socket.on("refreshTable", function(refreshplateau) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let newi = i;
                newi = i.toString();
                let newj = j;
                newj = newj.toString();
                let newnewvar = newi.concat(newj);

                if (refreshplateau[i][j] == 1) {
                    document.getElementById(newnewvar).style.backgroundColor = "Red";
                }
                if (refreshplateau[i][j] == 2) {
                    document.getElementById(newnewvar).style.backgroundColor = "Yellow";
                }
            }
        }
    });



    socket.on("plateauRemplie", function() {
        document.getElementById("playerTurn").innerHTML = "Plateau Plein Replay"
    });

    // Si le serveur envoie au client un emit reset alors le client doit reset son tableau
    socket.on('reset', function() {
        won = false;
        var tdElement = document.getElementsByTagName('td');
        for (var i = 0; i < tdElement.length; i++) {
            tdElement[i].style.backgroundColor = 'rgba(250, 250, 250, 0.5)';
        }
    });

    socket.on("replayResetColor", function(whoPlaying) {
        $("td button").hover(function() {
            $(this).css("background-color", "rgba(255, 0, 0, .1)");
        }, function() {
            $(this).css("background-color", "inherit");
        });
        document.getElementById("playerTurn").style.color = "#FD5A5A";
    });




    // Change la couleur du text par rapport au tour du joueur.
    socket.on('whoisPlaying', function(newnewvar, whoPlaying, userList) {
        if (won == false) {
            document.getElementById('errorMessages').style.visibility = 'hidden';
            if (whoPlaying == 1) {
                document.getElementById(newnewvar).style.backgroundColor = "#FF4F4F";
                document.getElementById("playerTurn").innerHTML = "Player " + userList[1] + " Turn"; //Change le text par rapport au tour du joueur
                document.getElementById("playerTurn").style.color = "#F8E957";

                $("td button").hover(function() {
                    $(this).css("background-color", "rgba(255, 255,0, .1)");
                }, function() {
                    $(this).css("background-color", "inherit");
                });

            } else if (whoPlaying == 2) {
                $("td button").hover(function() {
                    $(this).css("background-color", "rgba(255, 0, 0, .1)");
                }, function() {
                    $(this).css("background-color", "inherit");
                });

                document.getElementById("playerTurn").innerHTML = "Player " + userList[0] + " Turn"; //Change le text par rapport au tour du joueur
                document.getElementById("playerTurn").style.color = "#FD5A5A";
                document.getElementById(newnewvar).style.backgroundColor = "#F8E957";
            }
        }
    });
    // Permet de changer la page html avec le nom du joueur qui gagne
    socket.on('isWon', function(whoPlaying, userList) {
        won = true;
        let theDiv = document.getElementById("playerTurn");

        if (whoPlaying == 1) {
            theDiv.innerHTML = userList[0] + " Won";
            theDiv.style.color = "#FD5A5A"

        } else {
            theDiv.innerHTML = userList[1] + " Won";
            theDiv.style.color = "yellow"

        }

    });


    // Permet l'envoie du username choisie au serveur
    socket.emit('username', username);

    // Permet d'envoyer le message se trouvant dans le form au serveur
    $('#messageForm').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        if ($('#message').val()) {
            socket.emit('getUsername', username);
            socket.emit('chat message', $('#message').val());
            $('#message').val('');
        }
        return false;
    });

    // Permet d'ajouté un Username et un message dans le chat
    socket.on('getUsername', function(chatUsername) {
        $('#messageList').append($('<h5>').text(chatUsername + ' : '));
    });

    socket.on('chat message', function(msg) {
        $('#messageList').append($('<li>').text(msg));
        let objDiv = document.getElementById("chat");
        objDiv.scrollTop = objDiv.scrollHeight;
    });

    // Permet d'écrire le nom du premier joueur au debut d'une partie
    socket.on('assignAColor', function(userList) {
        document.getElementById("playerTurn").innerHTML = "Player " + userList[0] + " Turn"; //Change le text par rapport au tour du joueur
    });

    // Design html par rapport a la deconnexion , si il y a asser de joueur , et si c'est votre tour
    socket.on('afficherDéconnexion', function() {
        document.getElementById('errorMessages').style.visibility = 'visible';
        document.getElementById('errorMessages').innerHTML = "L'adversaire à quitté";
    });
    socket.on('needMorePlayer', function() {
        document.getElementById('errorMessages').innerHTML = "You need 2 Players";
    });
    socket.on('notYourTurn', function() {
        document.getElementById('errorMessages').style.visibility = 'visible';
        document.getElementById('errorMessages').innerHTML = "Not Your Turn";
    });
    // Permet d'afficher le nombre de player 
    socket.on('numberOfPlayer', function(numberOfPlayer) {
        document.getElementById('nombreDeJoueur').innerHTML = numberOfPlayer;
    });
});

function replay() {
    won = false;
    socket.emit('replay');
}