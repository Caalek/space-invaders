const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

const playerWidth = 64
const playerHeight = 32
const invaderHeight = 48
const invaderWidth = 32
const bulletHeight = 6
const bulletWidth = 17

let direction = 'right'
let xChange = 0;
let points = 0
document.addEventListener('keydown', playerMovement, false)
document.addEventListener('keyup', playerStopMovement, false)

let invaders = []
let bullets = []
let invaderBullets = []

player = new Player(620, 680, playerWidth, playerHeight)

function initGame() {
    let x = 75
    let y = 150
    for (i = 0; i <= 41; i++) {
        invader = new Invader(x, y, invaderHeight, invaderWidth)
        invaders.push(invader)
        x += 75
        if (i == 13) {
            y += 75
            x = 75
        }
        if (i == 27) {
            y += 75
            x = 75
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(player.image, player.x, player.y, playerWidth, playerHeight)
    drawInvaders()
    drawPoints()
    drawLives()
    drawHighScore()
    invaderShooting()
    drawAndMoveInvaderBullets()
    checkInvaderCollision()
    drawAndMoveBullets()
    checkPlayerCollision()
    checkBorderCollision()
    player.x = player.x + xChange

    if (invaders.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        document.removeEventListener('keydown', playerMovement, false)
        document.removeEventListener('keyup', playerStopMovement, false)
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.font = `68px 'Press Start 2P', cursive`
        ctx.fillText('You won!', canvas.width / 2, canvas.height / 2)

        if (points > parseInt(sessionStorage.getItem('highScore')) || sessionStorage.getItem('highScore') === null) {
            sessionStorage.setItem('highScore', points)
        }

        clearInterval(gameRunning)
    }

    if (player.lives <= 0) {
        player.isAlive = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        document.removeEventListener('keydown', playerMovement, false)
        document.removeEventListener('keyup', playerStopMovement, false)
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.font = `68px 'Press Start 2P', cursive`
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2)
        ctx.font = `24px 'Press Start 2P', cursive`
        ctx.textAlign = 'center'
        ctx.fillText(`Score: ${points}`,canvas.width / 2, canvas.height / 2 + 50)
        ctx.font = `18px 'Press Start 2P', cursive`
        ctx.fillText('Press F5 to play again', canvas.width / 2, canvas.height / 2 + 100)
        if (points > parseInt(sessionStorage.getItem('highScore')) || sessionStorage.getItem('highScore') === null) {
            sessionStorage.setItem('highScore', points)  
        }
        clearInterval(gameRunning)
    
    }
}

function playerMovement(e) {
    if (e.keyCode == '68' || e.keyCode == '39') {
        xChange = player.speed
    } else if (e.keyCode == '65' || e.keyCode == '37') {
        xChange = -1 * player.speed
    } else if (e.keyCode == '32') {
        const bullet = new Bullet(player.x + playerWidth / 2 , player.y + playerHeight / 2, bulletHeight, bulletWidth)
        shootEffect = new Audio('assets/audio/shoot.mp3')
        shootEffect.volume = 0.3
        shootEffect.play()
        bullets.push(bullet)
    }
}

function playerStopMovement(e) {
    if (e.keyCode == '68' || e.keyCode == '39') {
        xChange = 0
    } else if (e.keyCode == '65' || e.keyCode == '37') {
        xChange = 0
    }
}

function Player(x, y, height, width) {
    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.isAlive = true
    this.speed = 2
    this.lives = 3
    this.image = new Image()
    this.image.src = 'assets/images/player.png'

}

function Invader(x, y, height, width) {
    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.isAlive = true
    this.speed = 0.2

    const invaderImages = ['invader.png', 'invader2.png', 'invader3.png']
    const randomImage = invaderImages[Math.floor(Math.random() * invaderImages.length)]
    this.image = new Image()
    this.image.src = `assets/images/${randomImage}`
}

function Bullet(x, y, height, width) {
    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.isVisible = true
    this.speed = 5
    this.image = new Image()
    this.image.src = 'assets/images/bullet.png'
}

function InvaderBullet(x, y, height, width) {
    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.isVisible = true
    this.speed = 4
    this.image = new Image()
    this.image.src = 'assets/images/bullet.png'
}

function drawInvaders() {
    for (let i in invaders) {
        if (canvas.width - invaders[i].x <= 75) {
            direction = 'left'
            break
        }
        else if (invaders[i].x <= 75) {
            direction = 'right'
            break
        }
    }
    for (let i in invaders) {
        if (direction === 'right') {invaders[i].x = invaders[i].x + invaders[i].speed}
        else if (direction === 'left') {invaders[i].x = invaders[i].x - invaders[i].speed}
        ctx.drawImage(invaders[i].image, invaders[i].x, invaders[i].y, invaders[i].height, invaders[i].width)
    }
}

function drawAndMoveBullets() {
    for (let i in bullets) {
        if (bullets[i].isVisible == true) {
            bullets[i].y = bullets[i].y - bullets[i].speed
            ctx.drawImage(bullets[i].image, bullets[i].x, bullets[i].y, bullets[i].height, bullets[i].width)
        }
    }
}

function drawAndMoveInvaderBullets() {
    for (let i in invaderBullets) {
        if (invaderBullets[i].isVisible == true) {
            invaderBullets[i].y = invaderBullets[i].y +  invaderBullets[i].speed
            ctx.drawImage(invaderBullets[i].image, invaderBullets[i].x, invaderBullets[i].y, invaderBullets[i].height, invaderBullets[i].width)
        }
    }
}

function checkInvaderCollision() {
    for (let i in invaders) {
        for (let j in bullets) {
            if (bullets[j].x < invaders[i].x + invaders[i].width &&
                bullets[j].x + bullets[j].width > invaders[i].x &&
                bullets[j].y < invaders[i].y + invaders[i].height &&
                bullets[j].y + bullets[j].height > invaders[i].y &&
                bullets[j].isVisible == true) {
                    const killedEffect = new Audio('assets/audio/killed.mp3')
                    killedEffect.volume = 0.5
                    killedEffect.play()
                    bullets[j].isVisible = false
                    invaders[i].isAlive = false
                    points += 10
                    invaders.splice(i, 1)
                    bullets.splice(j, 1)
                }
        }
    }
}

function checkPlayerCollision() {
    for (let i in invaderBullets) {
        if (invaderBullets[i].x < player.x + player.width &&
            invaderBullets[i].x + invaderBullets[i].width > player.x &&
            invaderBullets[i].y < player.y + player.height &&
            invaderBullets[i].y + player.height > player.y &&
            invaderBullets[i].isVisible == true) {
                invaderBullets[i].isVisible = false
                player.lives -= 1
                invaderBullets.splice(i, 1)
            }
    }
}

function invaderShooting() {
    let diceRoll = Math.floor(Math.random() * 101)
    if (diceRoll > 97) {
        let randomInvader = invaders[Math.floor(Math.random() * invaders.length)]
        let invaderBullet = new InvaderBullet(randomInvader.x, randomInvader.y, bulletHeight, bulletWidth)
        invaderBullets.push(invaderBullet)
    }
}

function drawPoints() {
    ctx.font = `20px 'Press Start 2P', cursive`
    ctx.fillStyle = 'white'
    ctx.fillText(`Score: ${points}`, 50, 50)
}

function drawHighScore() {
    ctx.font = `20px 'Press Start 2P', cursive`
    ctx.fillStyle = 'white'
    let highScore = sessionStorage.getItem('highScore')
    if (highScore === null) { highScore = 0 }
    ctx.fillText(`High score: ${highScore}`, 300, 50)
}

function drawLives() {
    let x = 1100 
    for (i = 0; i < player.lives; i++) {
        ctx.font = `20px 'Press Start 2P', cursive`
        ctx.fillStyle = 'white'
        ctx.fillText('Lives:', 800, 55)
        ctx.drawImage(player.image, x, 20, playerWidth, playerHeight)
        x -= 75
    }
}

function checkBorderCollision() {
    if (player.x <= 0) { player.x = 1 }
    else if (player.x >= canvas.width - player.width * 2) { player.x = canvas.width - player.width * 2 - 1 }
}

initGame()
gameRunning = setInterval(update, 10)