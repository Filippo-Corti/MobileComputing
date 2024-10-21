function divisoriDi(n) {
    const divisori = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i == 0) {
            divisori.push(i)
            divisori.push(n / i)
        }
    }
    return divisori
}

const c1 = 10, c2 = 2

const divisoriDiC1 = divisoriDi(c1)
console.log(divisoriDiC1)

if (divisoriDiC1.includes(c2))
    console.log("Divisore")
else
    console.log("Non Divisore")