const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Max life for you and the monster", "100");


let chosenMaxLife = parseInt(enteredValue); //changes the value from the string into a number
let battleLog = [];
let lastLoggedEntry;

//checks is the value entered is a number and if not sets a default value to 100
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
        let logEntry = {
            event: event,
            value: value,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };

    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = "MONSTER"
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = "PLAYER"
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = "PLAYER"
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: event,
                value: value,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        default:
            logEntry = {};
    }
    // if (event === LOG_EVENT_PLAYER_ATTACK) {
    //     logEntry.target = "MONSTER"
    // } else if  (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry.target = "MONSTER"
    // } else if  (event === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry.target = "PLAYER"
    // } else if (event === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry.target = "PLAYER"
    // } else if (event === LOG_EVENT_GAME_OVER) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

//checks health levels after every attack/heal click
function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You should be dead but your bonus life saved you!");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert ("You WON!");
        writeToLog(LOG_EVENT_GAME_OVER, "PLayer Won!", currentMonsterHealth, currentPlayerHealth);
        reset();
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0 ) {
        alert ('You LOST!');
        writeToLog(LOG_EVENT_GAME_OVER, "Monster Won!", currentMonsterHealth, currentPlayerHealth);
        reset();
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert ("You have a DRAW!");
        writeToLog(LOG_EVENT_GAME_OVER, "Draw!", currentMonsterHealth, currentPlayerHealth);
        reset();
    }
}

//function subs the attack value given from clicking on an attack button using the values above. 
function attackMonster(mode) {
    // Ternary Operator example
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if (mode === MODE_ATTACK) {
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // } else if (mode === MODE_STRONG_ATTACK)  {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }

//stops code duplication for every attack function. Here we can add as many attacks as we like by creating new const values     
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function attackHandler() {
    attackMonster("ATTACK");
}

function strongAttackHandler() {
    attackMonster("STRONG_ATTACK")
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal to more than your max initial health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function printLogHandler() {
//for loop ----------------------
//this loop will start at 10 but minus one before logging so it will count from 9 to 0
    // for(let i = 10; i > 0;) {
    //     i--;
    //     console.log(i);
    // }

    // for (let i = 0; i < battleLog.length; i++) {
    //     console.log(battleLog[i]);
    // }

//------------------------------

// note: normal for loops give you access to the index of the element, for-of loops do not

// for-of loop & for-in loop --------------
    let i = 0;
    for (const logEntry of battleLog) {
        if (!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < i){
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`${key} => ${logEntry[key]}`); //
            }
            lastLoggedEntry = i;
            break;
            
        }
        i++;
        
    } 

//------------------------------

//
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);