    generate_table();

    let isAiActive = false;
    let whoPlaying = 1;
    let canPlay = true;

    var plateau = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
    // Permet un hover des cases de la grille en rouge
    $("td button").hover(function() {
        $(this).css("background-color", "rgba(255, 0, 0, .1)");
    }, function() {
        $(this).css("background-color", "inherit");
    });



    //Génération du tableau  
    function generate_table() {

        var body = document.getElementsByTagName("body")[0];

        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");

        for (var i = 0; i < 6; i++) {

            var row = document.createElement("tr");
            row.setAttribute("id", i + 1);

            for (var j = 0; j < 7; j++) {
                var cell = document.createElement("td");
                let btn = document.createElement("BUTTON");

                //Permet de donner un id a chaque td comme ca il sont accessible. 
                let tempi = i.toString();
                let tempJ = j.toString();
                let newvar = tempi.concat(tempJ)
                cell.setAttribute("id", newvar);

                var cellText = document.createTextNode(" ");
                let emplacementBouton = newvar % 10 + 1;

                btn.onclick = function() {

                    if (placeAColor(emplacementBouton)) {
                        checkWin();
                        changeTourEtHover();
                        changeTourDesign();
                        playSound();
                        plateauRemplie();

                    } else {
                        return 1;
                    }

                    if (isAiActive)
                        IA();
                };
                cell.appendChild(cellText);
                cell.appendChild(btn)
                row.appendChild(cell);
            }

            tblBody.appendChild(row);
        }

        tbl.appendChild(tblBody);
        body.appendChild(tbl);
        tbl.setAttribute("border", "2");
    }

    function playSound() {
        var snd = new Audio("Audio/coin.wav");
        snd.play();
    }

    function wonSound() {
        var wonSound = new Audio("Audio/winsound.wav");
        wonSound.play();
    }

    function placeAColor(a) { //Permet de placer une piece dans une collone a 

        if (canPlay == true) { // Si la partie n'est pas finie
            a--; // Ne sert plus c'étais pour quand l'utilisateur rentrai un chiffre a la main
            for (let i = 5; i >= 0; i--) {
                if (plateau[0][a] != 0) {
                    console.log("Case Pleine");
                    return 0;
                }
                if (plateau[i][a] == 0) {
                    plateau[i][a] = whoPlaying; //Place la case a l'emplacement donné donc collone a et ligne "case" i
                    return 1;
                }
            }
            console.log(plateau.join("\n") + "\n\n"); //Permet de mettre le tableau en colonne sinon il est en ligne

        }

    }
    // Tour
    function changeTourEtHover() { // Change le tour 

        if (whoPlaying == 1) {
            whoPlaying = 2;
            console.log()
            $("td button").hover(function() {
                $(this).css("background-color", "rgba(255, 255, 0, .1)");
            }, function() {
                $(this).css("background-color", "inherit");
            });
        } else {
            whoPlaying = 1;

            $("td button").hover(function() {
                $(this).css("background-color", "rgba(255, 0, 0, .1)");
            }, function() {
                $(this).css("background-color", "inherit");
            });
        }
    }

    function changeTourDesign() { // Change  le design par rapport au tour du joueur
        document.getElementById("playerTurn").innerHTML = "Player " + whoPlaying + " Turn"; //Change le text par rapport au tour du joueur
        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= 6; j++) {
                if (plateau[i][j] == 1) {
                    let tempi = i.toString();
                    let tempJ = j.toString();
                    let newvar = tempi.concat(tempJ)
                    document.getElementById(newvar).style.backgroundColor = "#FD5A5A";

                } else if (plateau[i][j] == 2) {
                    let tempi = i.toString();
                    let tempJ = j.toString();
                    let newvar = tempi.concat(tempJ)
                    document.getElementById(newvar).style.backgroundColor = "#F8E957";
                }
            }
            if (whoPlaying == 1) {
                document.getElementById("playerTurn").style.color = "rgb(253, 90, 90)";
            } else {
                document.getElementById("playerTurn").style.color = "#F8E957";

            }
        }

    }
    // Victoire
    function checkWin() { //Verifie les alignements pour les victoires
        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= 6; j++) {
                if (plateau[i][j] == whoPlaying && plateau[i][j + 1] == whoPlaying && plateau[i][j + 2] == whoPlaying && plateau[i][j + 3] == whoPlaying) {

                    highlightWon(i, j, "horizontal");
                    Won();
                    return 1;
                }
                if (i >= 3) {
                    if (plateau[i][j] == whoPlaying && plateau[i - 1][j] == whoPlaying && plateau[i - 2][j] == whoPlaying && plateau[i - 3][j] == whoPlaying) {
                        //Check Vertical
                        highlightWon(i, j, "vertical");

                        Won();
                        return 1;
                    }
                    //Check Diagonal

                    if (plateau[i][j] == whoPlaying && plateau[i - 1][j - 1] == whoPlaying && plateau[i - 2][j - 2] == whoPlaying && plateau[i - 3][j - 3] == whoPlaying) {

                        highlightWon(i, j, "diagonalNegative");
                        Won();
                        return 1;
                    }
                    if (plateau[i][j] == whoPlaying && plateau[i - 1][j + 1] == whoPlaying && plateau[i - 2][j + 2] == whoPlaying && plateau[i - 3][j + 3] == whoPlaying) {

                        highlightWon(i, j, "diagonalPositive");


                        Won();
                        return 1;
                    }
                }
            }
        }
    }

    function Won() { //Change le design si il y a une victoire
        wonSound();
        console.log("You won !!");
        canPlay = false;
        let wontext = document.getElementById("wonText");
        wontext.innerHTML += "Player " + whoPlaying + " Won";
        if (whoPlaying == 2) {
            wontext.style.color = "#F8E957";
        } else {
            wontext.style.color = "#FD5A5A";
        }
        document.getElementById("iaButton").style.display = "none"
        document.getElementById("playerTurn").style.display = "none"
        wontext.style.display = "inherit";

    }

    function highlightWon(i, j, position) { // Met en surbrillance les pions qui on gagné
        if (position == "horizontal") {
            let tempi = i.toString();
            console.log(i + "," + j)
            for (let c = 0; c < 4; c++) {
                let tempJ = j.toString();
                j += 1;
                let newvar = tempi.concat(tempJ)
                console.log(newvar)
                document.getElementById(newvar).style.outline = "solid"
            }
            return 1;
        }
        if (position == "vertical") {
            let tempJ = j.toString();
            console.log(i + "," + j)

            for (let c = 0; c < 4; c++) {
                let tempi = i.toString();
                i -= 1;
                let newvar = tempi.concat(tempJ)
                console.log(newvar)
                document.getElementById(newvar).style.outline = "solid"
            }
            return 1;


        }

        if (position == "diagonalPositive") {
            for (let c = 0; c < 4; c++) {
                let tempJ = j.toString();
                let tempi = i.toString();
                i -= 1;
                j += 1;
                let newvar = tempi.concat(tempJ)
                console.log(newvar)
                document.getElementById(newvar).style.outline = "solid"

            }
            return 1;
        }
        if (position == "diagonalNegative") {
            console.log("checkne")

            for (let c = 0; c < 4; c++) {
                let tempJ = j.toString();
                let tempi = i.toString();
                i -= 1;
                j -= 1;
                let newvar = tempi.concat(tempJ)
                console.log(newvar)
                document.getElementById(newvar).style.outline = "solid"
            }
            return 1;
        }
    }
    // Replay
    function replay() { //Relance la partie
        document.location.reload(true);
    }
    // Plateau Remplie
    function plateauRemplie() { //Verifie si le plateau est remplie
        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= 6; j++) {
                if (plateau[i][j] == 0) {
                    return 0;
                }
            }
        }
        plateauRemplieChangeDesign();
    }

    function plateauRemplieChangeDesign() { //Change le design si le plateau est remplie 
        canPlay = false;
        document.getElementById("playerTurn").innerHTML = "Plateau Remplie"
        console.log("Plateau Remplie")


    }




    // IA  
    function initialiseIA() {
        isAiActive = true;
        document.getElementById("iaButton").style.backgroundColor = "#FD5A5A"

    }

    function IA() {
        if (whoPlaying == 2 && isAiActive) {

            if (IACheckHorizontal()) {
                return 1
            }
            if (IACheckVertical()) {
                return 1
            }

            if (IACheckDiagolanePositive()) {
                return 1;
            }
            if (IACheckDiagolaneNegative()) {
                return 1;
            }
            if (savoirSicollonePleine(3) == false) {
                InitalizePlacement(4);
                return 1;
            }
            let randomNumber = Math.floor(Math.random() * (8 - 1)) + 1;
            InitalizePlacement(randomNumber);
            return 1;

        }


    }

    function savoirSicollonePleine(collone) {
        if (plateau[0][collone] != 0) {
            return true;
        }

        return false;
    }

    function InitalizePlacement(where) {

        placeAColor(where);

        checkWin();
        changeTourEtHover();
        changeTourDesign();
        plateauRemplie();
    }

    function IACheckHorizontal() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (plateau[i][j] == 1 && plateau[i][j + 1] != 2) {
                    if (plateau[i][j + 1]) {
                        if (plateau[i][j + 2] == 1 && plateau[i][j + 3] == 0 && (i == 5 || plateau[i + 1][j + 3] != 0)) {
                            InitalizePlacement(j + 4);
                            return 1;
                        } else if (plateau[i][j + 3] == 1 && plateau[i][j + 2] == 0 && (i == 5 || plateau[i + 1][j + 2] != 0)) {
                            InitalizePlacement(j + 3);
                            return 1;
                        }

                    } else if (plateau[i][j + 2] == 1 && plateau[i][j + 3] == 1 && plateau[i][j + 1] == 0 && (i == 5 || plateau[i + 1][j + 1] != 0)) {
                        console.log("Tuché")
                        InitalizePlacement(j + 2);
                        return 1
                    }
                } else if (plateau[i][j] == 0 && plateau[i][j + 1] == 1 && plateau[i][j + 2] == 1 && plateau[i][j + 3] == 1 && (i == 5 || plateau[i + 1][j] != 0)) {
                    InitalizePlacement(j + 1);
                    return 1;
                }
            }

        }
    }

    function IACheckVertical() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (i >= 3) {
                    if (plateau[i][j] == 1 && plateau[i - 1][j] != 2) {
                        if (plateau[i - 1][j]) {
                            if (plateau[i - 2][j] == 1 && plateau[i - 3][j] == 0) {
                                InitalizePlacement(j + 1);
                                return 1;
                            }
                        }

                    }
                }
            }
        }
    }

    function IACheckDiagolanePositive() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (i > 3) {
                    if (plateau[i][j] == 1) {
                        if (plateau[i - 1][j + 1]) {
                            if (plateau[i - 2][j + 2] == 1 && plateau[i - 3][j + 3] == 0 && (plateau[i - 2][j + 3] != 0)) {
                                InitalizePlacement(j + 4);
                                return 1;
                            }
                            if (plateau[i - 2][j + 2] == 0 && plateau[i - 3][j + 3] == 1 && (plateau[i - 1][j + 2] != 0)) {
                                InitalizePlacement(j + 3);
                                return 1;
                            }

                        } else if (plateau[i - 1][j + 1] == 0 && plateau[i - 2][j + 2] == 1 && plateau[i - 3][j + 3] == 1 && plateau[i][j + 1] != 0) {
                            InitalizePlacement(j + 2);
                            return 1;
                        }

                    }


                    if (plateau[i][j] == 0 && plateau[i - 1][j + 1] == 1 && plateau[i - 2][j + 2] == 1 && plateau[i - 3][j + 3] == 1 && (i == 5 || plateau[i - 2][j + 1] != 0)) {
                        console.log(j);

                        InitalizePlacement(j + 1);

                        return 1;
                    }
                }
            }
        }
    }

    function IACheckDiagolaneNegative() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (i >= 3) {
                    if (plateau[i][j] == 1 && plateau[i - 1][j - 1] != 2) {
                        if (plateau[i - 1][j - 1]) {
                            if (plateau[i - 2][j - 2] == 1 && plateau[i - 3][j - 3] == 0 && (plateau[i - 2][j - 3] != 0)) {
                                InitalizePlacement(j - 2);
                                return 1;
                            }
                            if (plateau[i - 2][j - 2] == 0 && plateau[i - 3][j - 3] == 1 && (plateau[i - 1][j - 2] != 0)) {
                                InitalizePlacement(j - 1);
                                return 1;
                            }

                        }
                        if (plateau[i - 1][j - 1] == 0 && plateau[i - 2][j - 2] == 1 && plateau[i - 3][j - 3] == 1 && (plateau[i][j - 1] != 0)) {

                            InitalizePlacement(j);
                            return 1;
                        }

                    }
                    if (plateau[i][j] == 0 && plateau[i - 1][j - 1] == 1 && plateau[i - 2][j - 2] == 1 && plateau[i - 3][j - 3] == 1 && (i == 5 || plateau[i + 1][j] != 0)) {

                        InitalizePlacement(j + 1);
                        return 1;
                    }
                }
            }
        }
    }