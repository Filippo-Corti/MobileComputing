function scriviRiga(c, len) {
    console.log(("" + c).repeat(len))
}

for(let i = 0; i < 5; i++) {
    scriviRiga(i*2+1, i+1)
}