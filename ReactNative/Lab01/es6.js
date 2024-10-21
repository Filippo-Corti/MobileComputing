function sottostringaDoppiaPiuLunga(s) {
    sottostringhe = {}
    for (let i = 0; i < s.length; i++) {
        for (let j = i+2; j <= s.length; j++) {
            const ss = s.substring(i, j)
            if (sottostringhe[ss])
                sottostringhe[ss] = sottostringhe[ss]+1
            else
                sottostringhe[ss] = 1
        }
    }

    console.log(sottostringhe)

    max_ss = ""
    for (const [ss, cont] of Object.entries(sottostringhe)) {
        if (cont >= 2 && ss.length > max_ss.length) {
            max_ss = ss
            max_freq = cont
        }
    }
    return max_ss
}


const c1 = "abbababbaa"

console.log(sottostringaDoppiaPiuLunga(c1))