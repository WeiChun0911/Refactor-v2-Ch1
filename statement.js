const statement = (invoice, plays) => {
    let totalAmount = 0

    let result = `Statement for ${invoice.customer}\n`

    for (let perf of invoice.performances) {
        // 印出這筆訂單
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`
        totalAmount += amountFor(perf)
    }
    result += `Amount owed is ${usd(totalAmount)}\n`
    result += `You earned ${totalVolumnCredits()} credits\n`
    return result

    function totalVolumnCredits() {
        let volumeCredits = 0
        for (let perf of invoice.performances) {
            volumeCredits += volumeCreditsFor(perf)
        }
        return volumeCredits
    }

    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(aNumber / 100)
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0
        result += Math.max(aPerformance.audience - 30, 0)
        if (playFor(aPerformance).type === 'comedy') result += Math.floor(aPerformance.audience / 5)
        return result
    }

    function playFor(perf) {
        return plays[perf.playID]
    }

    function amountFor(aPerformance) {
        let result = 0
        switch (playFor(aPerformance).type) {
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
                throw new Error(`unknown type: ${playFor(aPerformance).type}`)
        }
        return result
    }
}

export default statement
