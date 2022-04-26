// Déclaration de variable pour serveur 

const { userInfo } = require('os');
let express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Déclaration de variable 
let numberofPlayer = 0;
let playerturn = 0;
let whoPlaying = 1;
let userList = [];
let userID = [];
let won;
var plateau = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

// Permet d'ouvrire la Page principale
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/MainPage.html');
});
// Permet d'utiliser tout ce qui se trouve dans le dossier public 
app.use(express.static('public'));

// La fonction se joue si quelqu'un se connecte. 
io.on('connection', (socket) => {

    socket.emit("refreshTable", plateau)

    // Permet de dresser une list des joueurs via leur ID
    userID.push(socket.id);
    numberofPlayer += 1;

    // Renvoie au client le nombre de joueurs pour tenir le client à jour
    io.emit('numberOfPlayer', numberofPlayer);

    // Permet de relancer la partie
    socket.on('replay', function() {
        if (socket.id == userID[playerturn] || won == true) {
            plateau = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
            ];
            console.log(plateau.join("\n") + "\n\n"); //Permet de mettre le tableau en colonne sinon il est en ligne
            // Demande a tout les clients de reset
            playerturn = 0;
            whoPlaying = 1;
            io.emit("replayResetColor", 1)
            io.emit('reset');
        }
    });

    // Gérer le tableau
    socket.on('placerUneCouleur', function(emplacement) {

        if (numberofPlayer >= 2) {

            // Si c'est bien le tour du joueur qui envoie une demande
            if (socket.id == userID[playerturn]) {

                // Vérification d'un numéro valide
                if (emplacement > 8 || emplacement <= 0 && !isNaN(emplacement)) {
                    console.log("Mauvais Numéro");
                    return 0;
                }
                emplacement--; //Permet de de pouvoir mettre 1 en collone et d'avoir la collone 1 et non pas 0.
                for (let i = 5; i >= 0; i--) {
                    if (i == 0 && plateau[i][emplacement] != 0) {
                        console.log("Case Pleine");
                        return 0;
                    }
                    if (plateau[i][emplacement] == 0) {
                        plateau[i][emplacement] = whoPlaying; //Place la case a l'emplacement donné donc collone a et ligne "case" i

                        let newi = i;
                        newi = i.toString();
                        let newa = emplacement;
                        newa = newa.toString();
                        let newnewvar = newi.concat(newa);

                        // Envoie au client ou changer la couleur 
                        io.emit("whoisPlaying", newnewvar, whoPlaying, userList);

                        // Verification de victoire
                        checkWin();

                        // Changement de tour 
                        if (whoPlaying == 1) {
                            whoPlaying = 2;
                        } else {
                            whoPlaying = 1;
                        }
                        break;

                    }
                }

                playerturn += 1;

                function checkWin() {

                    for (let i = 0; i <= 5; i++) {
                        for (let j = 0; j <= 6; j++) {

                            //Premier numéro == ligne deuxieme numéro collone
                            if (plateau[i][j] == whoPlaying && plateau[i][j + 1] == whoPlaying && plateau[i][j + 2] == whoPlaying && plateau[i][j + 3] == whoPlaying) {
                                // Check Horizontale
                                console.log(whoPlaying + " Won")
                                    // Fonction Won
                                io.emit('isWon', whoPlaying, userList);
                                won = true;
                                return 1;
                            }
                            if (i >= 3) {
                                if (plateau[i][j] == whoPlaying && plateau[i - 1][j] == whoPlaying && plateau[i - 2][j] == whoPlaying && plateau[i - 3][j] == whoPlaying) {
                                    //Check Vertical
                                    console.log(whoPlaying + " Won")
                                    won = true;

                                    // Fonction Won
                                    io.emit('isWon', whoPlaying, userList);
                                    won = true;

                                    return 1;
                                }
                                if (plateau[i][j] == whoPlaying && plateau[i - 1][j - 1] == whoPlaying && plateau[i - 2][j - 2] == whoPlaying && plateau[i - 3][j - 3] == whoPlaying || plateau[i][j] == whoPlaying && plateau[i - 1][j + 1] == whoPlaying && plateau[i - 2][j + 2] == whoPlaying && plateau[i - 3][j + 3] == whoPlaying) {
                                    //Check Diagonal
                                    console.log(whoPlaying + " Won")
                                        // Fonction Won
                                    io.emit('isWon', whoPlaying, userList);
                                    won = true;

                                    return 1;
                                }
                            }
                        }
                    }
                }

                function plateauRemplie() {
                    for (let i = 0; i <= 5; i++) {
                        for (let j = 0; j <= 6; j++) {

                            // Si la boucle tombe sur un zéro elle sort sinon le plateau est remplie
                            if (plateau[i][j] == 0) {
                                return 0;
                            }

                        }
                    }
                    io.emit("plateauRemplie");
                    return 1;
                }





                if (playerturn > 1) {
                    playerturn = 0;
                }

                // Si ce n'est pas le tour du joueur. 
            } else {
                io.to(socket.id).emit('notYourTurn', 'Not your turn');
            }

            // Si il n'y a pas asser de joueur.
        } else {
            io.emit('needMorePlayer', 'Not enougth Player');
        }
    });


    function replay() {
        plateau = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        won = false;
    }


    // Chat


    // Si le serveur reçoit un username il va le push dans la list des users
    socket.on('username', (username) => {

        // Seulement si il est premier ou deusieme dans la liste des userID ce qui permet d'empecher les spectateurs d'entrée
        if ((socket.id == userID[0] || socket.id == userID[1])) {
            userList.push(username);
        }

        // Permet de de changer le text des clients avec le premier joueur.
        io.emit('assignAColor', userList, whoPlaying);

    });


    socket.on('getUsername', (username, message) => {
        io.emit('getUsername', username);
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // La fonction se joue quand il y a une déconnexion
    socket.on('disconnect', (reason) => {
        // Réduction du nombre de joueur actif, Update sur les cliens .
        numberofPlayer -= 1;
        io.emit('numberOfPlayer', numberofPlayer);

        // Permet de savoir qui s'est déconnecter et de le retirer des lists
        let whoDisconnected = userID.indexOf(socket.id);
        userID.splice(whoDisconnected, 1);
        userList.splice(whoDisconnected, 1);

        // Permet de réassigner ou de vérifier si le premier joueur est toujours existant.
        io.emit('assignAColor', userList);

        // Permet seulement au joueur et non spectateur de reset la partie
        if ((socket.id == userID[0] || socket.id == userID[1])) {

            replay();
            io.emit('reset');
        }
        // Si il n'y a plus de joueur la partie se reset
        if (userID == 0) {
            replay();
            io.emit('reset');
        }
        // Si un des deux joueurs se déco 
        if (whoDisconnected <= 1) {
            io.emit("afficherDéconnexion");
        }
    });

});


// Permet d'heberger le serveur sur le port 5000.
http.listen((process.env.PORT || 5000), () => {
    console.log('listening on localhost:5000');
});