const statement = (invoice, plays) => {
    return renderPlainText(createStatementData(invoice, plays))
}

function createStatementData(invoice, plays) {
    const statementData = {}
    statementData.customer = invoice.customer
    statementData.performances = invoice.performances.map(enrichPerformance)
    statementData.totalAmount = totalAmount(statementData)
    statementData.totalVolumnCredits = totalVolumnCredits(statementData)
    return statementData

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0)
    }

    function totalVolumnCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
    }
    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance)
        result.play = playFor(result)
        result.amount = amountFor(result)
        result.volumeCredits = volumeCreditsFor(result)
        return result
    }
    function playFor(perf) {
        return plays[perf.playID]
    }

    function amountFor(aPerformance) {
        let result = 0
        switch (aPerformance.play.type) {
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

    function volumeCreditsFor(aPerformance) {
        let result = 0
        result += Math.max(aPerformance.audience - 30, 0)
        if (aPerformance.play.type === 'comedy') result += Math.floor(aPerformance.audience / 5)
        return result
    }
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`

    for (let perf of data.performances) {
        // 印出這筆訂單
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`
    result += `You earned ${data.totalVolumnCredits} credits\n`
    return result

    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(aNumber / 100)
    }
}

export default statement
