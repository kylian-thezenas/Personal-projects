const canvas  = document.getElementById("canvas");
const grille = canvas.getContext('2d');
const tX = canvas.getAttribute('width');
const tY = canvas.getAttribute('height');
let niveauIA = 1;
let tabPions = [[0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]];
const largeurGrille = 400;
const c = largeurGrille/8;
let col, row;
let moveAfaire;
let compteN,compteB,pionVide;
let tabExplo = [];
function donnerNiveauIA(x){
    niveauIA=x;
}
function afficherRegle(){
    if ( confirm(   "Le plateau de jeu represente un damier de 64 cases, chaque joueur" +
                    "dispose  de 32 jetons chacun, chaque face est noire d'un cote, " +
                    "blanche de l'autre." +
                    "Vous prenez les jetons en les retournant du cote de votre couleur." +
                    "Au depart, 2 pions de chaque couleur sont disposes sur les 4 cases " +
                    "centrales. A tour de role, chacun pose un jeton avec l'obligation " +
                    "de retourner au moins un jeton adverse. Votre jeton doit etre pose " +
                    "de maniere a entourer 1 ou plusieurs jetons adverses." +
                    "Un jeton peut prendre simultanement dans les direction horizontales, " +
                    "veritcales et diagonales." +
                    "La partie se termine quand tous le jetons sont poses, ou si aucun " +
                    "joueur ne peut plus jouer." +
                    "Le vainqueur est celui qui possede le plus de jetons de sa couleur " +
                    "sur le plateau." +
                    "Comment jouer :" +
                    "Pour poser un pion, cliquez sur la cases de votre choix." +
                    "Si vous ne pouvez pas jouer, cliquez sur le bouton 'Passe'." +
                    "Si vous aimez la difficulte, selectionner un niveau de difficulte superieur." )) {

    } else {
        // Code à éxécuter si l'utilisateur clique sur "Annuler"
    }
}
function dessineG(){                                //fonction qui trace le plateau
    grille.fillStyle = "rgb(0,128,0)";
    grille.fillRect (0, 0, largeurGrille, largeurGrille);
    grille.strokeStyle="#000000";
    grille.lineWidth = 4;
    grille.beginPath();
    for (let n = 1; n < 8; n++) {                       // et la grille
        grille.moveTo(n*c, 0);
        grille.lineTo(n*c, 400);
        grille.moveTo(400, n*c);
        grille.lineTo(0, n*c);
    }
    grille.stroke();
}
function dessinePion(){
    for (let py = 0; py < 8; py++) {
        for(let px = 0; px < 8; px++) {                             // on parcoure le tableau de jeu
            if (tabPions[py][px] === 0){
                grille.fillStyle = "rgb(0,128,0)";
                grille.beginPath();
                grille.arc(px*50+25, py*50+25, (c/2)-8, 0, 2*Math.PI, true);
                grille.fill();
            }
            if(tabPions[py][px] === 1){
                grille.fillStyle = "#FFFFFF";
                grille.beginPath();
                grille.arc(px*50+25, py*50+25, (c/2)-8, 0, 2*Math.PI, true);
                grille.fill();
            }
            if(tabPions[py][px] === 2){
                grille.fillStyle = "#000000";
                grille.beginPath();
                grille.arc(px*50+25, py*50+25, (c/2)-8, 0, 2*Math.PI, true);
                grille.fill();
            }
        }
    }
}
function exploration(coox,cooy,modx,mody,actif,autre,n){
    if((tabPions[cooy][coox]===0 || (n!==1 &&tabPions[cooy][coox]===autre) ) && (coox+modx>-1 && coox+modx<8) && (cooy+mody>-1 && cooy+mody<8) && tabPions[cooy+mody][coox+modx]===autre){
        return exploration(coox+modx,cooy+mody,modx,mody,actif,autre,n+1);
    }
    return n !== 1 && (coox + modx > -1 && coox + modx < 8) && (cooy + mody > -1 && cooy + mody < 8) && tabPions[cooy + mody][coox + modx] === actif;
}
function mainExplo(actif,autre){
    tabExplo=[];
    for(let x=0;x<8;x++){
        for(let y=0;y<8;y++){
            let ex1=exploration(x,y,0,1,actif,autre,1);//bas
            let ex2=exploration(x,y,1,1,actif,autre,1);//bas+droite
            let ex3=exploration(x,y,1,0,actif,autre,1);//droite
            let ex4=exploration(x,y,1,-1,actif,autre,1);//haut+droite
            let ex5=exploration(x,y,0,-1,actif,autre,1);//haut
            let ex6=exploration(x,y,-1,-1,actif,autre,1);//haut+gauche
            let ex7=exploration(x,y,-1,0,actif,autre,1);//gauche
            let ex8=exploration(x,y,-1,1,actif,autre,1);//bas+gauche
            if(ex1===true||ex2===true||ex3===true||ex4===true||ex5===true||ex6===true||ex7===true||ex8===true){
                tabExplo.push([x,y]);
            }
        }
    }
}
function changeCoul(coox,cooy,modx,mody,actif,autre,n){
    if((coox+modx>-1 && coox+modx<8) && (cooy+mody>-1 && cooy+mody<8) && tabPions[cooy+mody][coox+modx]===autre){
        let temp = changeCoul(coox+modx,cooy+mody,modx,mody,actif,autre,n+1);
        if(temp){
            tabChang.push([coox+modx,cooy+mody]);
            return true;
        }
    }
    return n !== 1 && (coox + modx > -1 && coox + modx < 8) && (cooy + mody > -1 && cooy + mody < 8) && tabPions[cooy + mody][coox + modx] === actif;
}
function mainChangeCoul(actif,autre){
    tabChang=[];
    changeCoul(col,row,0,1,actif,autre,1);
    changeCoul(col,row,1,1,actif,autre,1);
    changeCoul(col,row,1,0,actif,autre,1);
    changeCoul(col,row,1,-1,actif,autre,1);
    changeCoul(col,row,0,-1,actif,autre,1);
    changeCoul(col,row,-1,-1,actif,autre,1);
    changeCoul(col,row,-1,0,actif,autre,1);
    changeCoul(col,row,-1,1,actif,autre,1);
    for(let i=0;i<tabChang.length;i++){
        var x=tabChang[i][0];
        var y=tabChang[i][1];
        tabPions[y][x]=actif;
        //compte autre -1
        //compte actif +1
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function minMaxPair(depth){

    if ((testFin===true) || (depth === 0)) {
        comptePions();
        return compteB;
    }

    let bestScore;
    let bestMove = [];// = tabExplo[getRandomInt(tabExplo.length)];

    if (depth%2===0) { //type Max = programme
        bestScore=-1000;                                //score = - infini
        mainExplo(1,2);
        let copie1 = tabExplo;
        for (let m=0; m<copie1.length; m++) {         // pour chaque move possible
            col = copie1[m][0];
            row = copie1[m][1];
            let temp = deepcopy(tabPions);
            tabPions[row][col] = 1;                     // on fait le move m
            mainChangeCoul(1,2);
            let score = minMaxPair(depth - 1);
            tabPions = temp;                  // on defait le move m
            if (score > bestScore) {
                bestScore = score;
                bestMove = copie1[m];                 // m devient le meilleur move si son score > tous
            }
        }
    } else { //type MIN = adversaire
        bestScore=1000;
        mainExplo(2,1);
        let copie2 = tabExplo;
        for (let m=0; m<copie2.length; m++) {         // pour chaque coup possible
            col = copie2[m][0];
            row = copie2[m][1];
            let temp = deepcopy(tabPions);
            tabPions[row][col] = 2;                     // on fait le move m
            mainChangeCoul(2,1);
            let score = minMaxPair(depth - 1)
            tabPions = temp;
            if (score < bestScore) {
                bestScore = score;
                bestMove = copie2[m];
            }
        }
    }
    if (depth !== 0){moveAfaire=bestMove;}
    return bestScore ;
}
function minMaxImpair(depth){
    if ((testFin===true) || (depth === 0)) {
        comptePions();
        return compteB;
    }

    let bestScore;
    let bestMove = [];// = tabExplo[getRandomInt(tabExplo.length)];

    if (depth%2!==0) { //type Max = programme
        bestScore=-1000;                                //score = - infini
        mainExplo(1,2);
        let copie1 = tabExplo;
        for (let m=0; m<copie1.length; m++) {         // pour chaque move possible
            col = copie1[m][0];
            row = copie1[m][1];
            let temp = deepcopy(tabPions);
            tabPions[row][col] = 1;                     // on fait le move m
            mainChangeCoul(1,2);
            comptePions();
            let score = minMaxImpair(depth - 1);
            tabPions = temp;                  // on defait le move m
            if (score > bestScore) {
                bestScore = score;
                bestMove = copie1[m];                 // m devient le meilleur move si son score > tous
            }
        }
    } else { //type MIN = adversaire
        bestScore=1000;
        mainExplo(2,1);
        let copie2 = tabExplo;
        for (let m=0; m<copie2.length; m++) {         // pour chaque coup possible
            col = copie2[m][0];
            row = copie2[m][1];
            let temp = deepcopy(tabPions);
            tabPions[row][col] = 2;                     // on fait le move m
            mainChangeCoul(2,1);
            let score = minMaxImpair(depth - 1)
            tabPions = temp;
            if (score < bestScore) {
                bestScore = score;
                bestMove = copie2[m];
            }
        }
    }
    if (depth !== 0){moveAfaire=bestMove;}
    return bestScore ;
}
function highlight(actif, autre){
    mainExplo(actif, autre);
    for (let i = 0 ; i < tabExplo.length ; i++) {
        grille.fillStyle = "rgb(234,246,13)";
        grille.beginPath();
        grille.arc(tabExplo[i][0] * 50+25, tabExplo[i][1] * 50+25, (c/2)-20, 0, 2*Math.PI, true);
        grille.fill();
    }
}
function testFin(){
    comptePions();
    mainExplo(2,1);
    let explo1 = tabExplo;
    mainExplo(1,2);
    let explo2 = tabExplo;
    if ((explo1.length === 0) && (explo2.length===0)){
        if(compteN>compteB){alert("Les noirs gagnent la partie1");}
        if(compteN<compteB){alert("Les blancs gagnent la partie2");}
        if(compteN===compteB){alert("égalité3");}
        return true;}
    else if((pionVide===0)||(compteN===0)||(compteB===0)){
        if(compteN>compteB){alert("Les noirs gagnent la partie4");}
        if(compteN<compteB){alert("Les blancs gagnent la partie5");}
        if(compteN===compteB){alert("égalité6");}
        return true;}
    return false;
}
function tourOrdi() {
    mainExplo(1,2);
    let random = getRandomInt(tabExplo.length);
    col = tabExplo[random][0];
    row = tabExplo[random][1];
    tabPions[row][col] = 1;
    mainChangeCoul(1,2);
    dessinePion();
    setTimeout(function (){testFin()}, 500);
    highlight(2,1);
    if(tabExplo.length===0){setTimeout(function(){tourOrdi()},250);}
}
function tourOrdi2(depth){
    mainExplo(1,2);
    if (tabExplo.length!==0){
        if (depth%2===0){                           // en fonction de la profondeur on utilise pas le meme minmax
            minMaxPair(depth);                      // les deux minMax font exactement la meme chose sauf que le noeud de
        }else{                                      // depart change en fonction de si la profondeur est pair ou impair
            minMaxImpair(depth);                    //  pair --> depth%2 === 2    ou  impair --> depth%2 !== 2
        }
        col= moveAfaire[0];// coupAJouer[0];
        row= moveAfaire[1];//coupAJouer[1];
        tabPions[row][col] = 1;
        mainChangeCoul(1,2);
        dessinePion();
    }
    setTimeout(function (){testFin()}, 500);
    highlight(2,1);
}
function game() {
    dessineG();
    dessinePion();
}
function comptePions(){
    compteB=0;
    compteN=0;
    pionVide=0;
    for (let j=0;j<8;j++){
        for(let i=0;i<8;i++){
            if(tabPions[j][i]===1){
                compteB+=1;
            }
            if(tabPions[j][i]===2){
                compteN+=1;
            }
            if(tabPions[j][i]===0){
                pionVide+=1;
            }
        }
    }
}
function deepcopy(t1){
    let temp=[[0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]];

    for (let i = 0; i < t1.length; i++) {
        for (let j = 0; j <t1[0].length ; j++) {
            temp[i][j]=t1[i][j];
        }

    }
    return temp;
}
function masquerDiv(){
    var container_Elt = document.getElementById('avantDebut');
    container_Elt.classList.add("le_div_masque");
    container_Elt.classList.remove("le_div_visible");
    var container_Elt = document.getElementById('apresDebut');
    container_Elt.classList.remove("le_div_masque");
    container_Elt.classList.add("le_div_visible");
}
function jouer(){
    //avantDebut.style.display = 'none';
    //apresDebut.style.display = 'block';
    dessineG();
    tabPions =[ [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0] ];
    dessinePion();
    highlight(2,1);
}
//game();
$("#canvas").click(function(e){
    let x = e.pageX - this.offsetLeft;
    let y = e.pageY - this.offsetTop
    if(x < c) {
        col = 0; }
    else if(x < 2*c) {
        col = 1; }
    else if(x < 3*c) {
        col = 2; }
    else if(x < 4*c) {
        col = 3; }
    else if(x < 5*c) {
        col = 4; }
    else if(x < 6*c) {
        col = 5; }
    else if(x < 7*c) {
        col = 6; }
    else if(x < 8*c) {
        col = 7; }
    else {
        col = 8; }
    if(y < c) {
        row = 0; }
    else if(y < 2*c) {
        row = 1; }
    else if(y < 3*c) {
        row = 2; }
    else if(y < 4*c) {
        row = 3; }
    else if(y < 5*c) {
        row = 4; }
    else if(y < 6*c) {
        row = 5; }
    else if(y < 7*c) {
        row = 6; }
    else if(y < 8*c) {
        row = 7; }
    else {
        row = 8; }
    mainExplo(2,1);
    for(let i = 0; i < tabExplo.length; i++) {
        if((tabExplo[i][0] === col) && (tabExplo[i][1] === row)) {
            tabPions[row][col] = 2;
            mainChangeCoul(2,1);
            dessinePion();
            testFin();
            setTimeout(function (){tourOrdi2(niveauIA)}, 500);
        }
    }
});