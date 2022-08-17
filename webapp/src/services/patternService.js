import axios from "axios";

export async function fetchPatterns(ticker, period1, period2) {
    try {
        let url = `http://127.0.0.1:5000/api/v1/patterns?ticker=${ticker}`;
        if (period1 && period2) {
            url += `&period1=${period1}&period2=${period2}`;
        }

        const patternsData = await (await axios.get(url)).data;
        patternsData.forEach(pattern => {
            pattern.close = parseFloat(pattern.close).toFixed(2);
        })
        return patternsData;
    } catch (err) {
        throw err;
    }
}
