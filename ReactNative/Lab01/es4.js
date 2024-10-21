const giorniSettimana = ["Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato", "Domenica"]

const giorniDiOttobre = []

for (let i = 1; i <= 31; i++) {
    giorniDiOttobre[i-1] = giorniSettimana[(i-1)%7] + " " + i + " Ottobre 2018"
}

console.log(giorniDiOttobre)