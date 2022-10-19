const statement = (invoice, plays) => {
    let totalAmount = 0
    let volumeCredits = 0
    let result = `Statement for ${invoice.customer}\n`
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format

    for (let perf of invoice.performances) {
        let thisAmount = amountFor(playFor(perf), perf)

        // 加入 volumn credit
        volumeCredits += Math.max(perf.audience - 30, 0)
        // 每5名喜劇觀眾可以額外獲得點數
        if (playFor(perf).type === 'comedy') volumeCredits += Math.floor(perf.audience / 5)
        // 印出這筆訂單
        result += `  ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`
        totalAmount += thisAmount
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`
    result += `You earned ${volumeCredits} credits\n`
    return result

    function playFor(perf) {
        return plays[perf.playID]
    }

    function amountFor(play, aPerformance) {
        let result = 0
        switch (play.type) {
            case 'tragedy': {
                result = 40000
                if (aPerformance.audience > 30) result += 1000 * (aPerformance.audience - 30)
                break
            }
            case 'comedy': {
                result = 30000
                if (aPerformance.audience > 20) result += 10000 + 500 * (aPerformance.audience - 20)
                result += 300 * aPerformance.audience
                break
            }
            default:
                throw new Error(`unknown type: ${play.type}`)
        }
        return result
    }
}

export default statement
