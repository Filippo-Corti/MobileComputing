async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec))
}

class User {

    constructor(nome, cognome) {
        this.nome = nome;
        this.cognome = cognome;
    }

    getFullName() {
        return this.nome + " " + this.cognome;
    }

}

async function getUserFromLocalDB(id) {
    console.log("Checking if user is in local DB")
    await sleep(2000)
    return
}

async function storeUserInLocalDB(user) {
    await sleep(2000)
    for (let i = 0; i < 10000000000; i++) {}
    console.log("Storing user in local DB")
    return
}

async function simulateHTTPGetUser(id) {
    console.log("Getting user from network")
    await sleep(2000)
    return new User("Sergio", "Mascetti")
}

async function getUtente(id) {
    let foundUser = await getUserFromLocalDB(id)
    if (!foundUser) {
        foundUser = await simulateHTTPGetUser(id)
        storeUserInLocalDB(foundUser)
    }
    return foundUser
}

const id = 0
getUtente(id).then((user) => console.log(user.getFullName()))


