// مدیریت ذخیره‌سازی
async function saveTrades(trades) {
    await chrome.storage.local.set({ trades });
}

async function loadTrades() {
    const result = await chrome.storage.local.get('trades');
    return result.trades || [];
}

// مدیریت فرم
document.getElementById('tradeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const trade = {
        date: document.getElementById('shamsiDate').value,
        symbol: document.getElementById('symbol').value,
        type: document.getElementById('tradeAction').value,
        price: parseInt(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('volume').value),
        fee: 0,
        reason: document.getElementById('reason').value
    };

    const trades = await loadTrades();
    trades.push(trade);
    await saveTrades(trades);
    updateUI(trades);
});

// تحلیل با هوش مصنوعی
document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const trades = await loadTrades();
    if (trades.length < 3) {
        alert("حداقل ۳ معامله برای تحلیل الزامی است!");
        return;
    }

    try {
        const API_URL = "https://your-api-url.com/api/analyze";
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trades)
        });
        const result = await response.json();
        document.getElementById('aiAnalysis').innerHTML = result.analysis;
    } catch (error) {
        console.error("خطا در تحلیل:", error);
        alert("خطا در ارتباط با سرور!");
    }
});

// بروزرسانی UI
async function updateUI(trades) {
    const tbody = document.getElementById('tradesList');
    tbody.innerHTML = '';
    trades.forEach(trade => {
        const row = `<tr>
            <td>${trade.date}</td>
            <td>${trade.symbol}</td>
            <td>${trade.type === 'buy' ? '🟢 خرید' : '🔴 فروش'}</td>
            <td>${trade.quantity}</td>
            <td>${trade.fee}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
    document.getElementById('tradeCount').textContent = trades.length;
}

// بارگذاری اولیه
(async () => {
    const trades = await loadTrades();
    updateUI(trades);
})();