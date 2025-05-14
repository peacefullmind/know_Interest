document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const dailyRateInput = document.getElementById('daily-rate');
    const monthlyRateInput = document.getElementById('monthly-rate');
    const yearlyRateInput = document.getElementById('yearly-rate');
    const aprInput = document.getElementById('apr');
    const principalInput = document.getElementById('principal');
    
    // 结果元素
    const dailyInterestEl = document.getElementById('daily-interest');
    const monthlyInterestEl = document.getElementById('monthly-interest');
    const yearlyInterestEl = document.getElementById('yearly-interest');
    
    // 比较表格元素
    const compDailyRateEl = document.getElementById('comp-daily-rate');
    const compMonthlyRateEl = document.getElementById('comp-monthly-rate');
    const compYearlyRateEl = document.getElementById('comp-yearly-rate');
    const compDailyInterestEl = document.getElementById('comp-daily-interest');
    const compYearlyInterestEl = document.getElementById('comp-yearly-interest');
    
    // 添加输入字段事件监听器，实现输入任意一个值都可以计算其他值
    dailyRateInput.addEventListener('input', () => convertFromDaily());
    monthlyRateInput.addEventListener('input', () => convertFromMonthly());
    yearlyRateInput.addEventListener('input', () => convertFromYearly());
    aprInput.addEventListener('input', () => convertFromAPR());
    principalInput.addEventListener('input', calculateInterest);
    
    // 从日利率转换
    function convertFromDaily() {
        if (!dailyRateInput.value) {
            clearResults();
            return;
        }
        
        const dailyRate = parseFloat(dailyRateInput.value);
        const monthlyRate = (dailyRate * 30.4167).toFixed(4); // 平均每月天数
        const yearlyRate = (dailyRate * 365).toFixed(4);
        const apr = (Math.pow(1 + dailyRate / 100, 365) - 1) * 100;
        
        monthlyRateInput.value = monthlyRate;
        yearlyRateInput.value = yearlyRate;
        aprInput.value = apr.toFixed(4);
        
        calculateInterest();
        updateComparisonTable();
    }
    
    // 从月利率转换
    function convertFromMonthly() {
        if (!monthlyRateInput.value) {
            clearResults();
            return;
        }
        
        const monthlyRate = parseFloat(monthlyRateInput.value);
        const dailyRate = (monthlyRate / 30.4167).toFixed(4);
        const yearlyRate = (monthlyRate * 12).toFixed(4);
        const apr = (Math.pow(1 + monthlyRate / 100, 12) - 1) * 100;
        
        dailyRateInput.value = dailyRate;
        yearlyRateInput.value = yearlyRate;
        aprInput.value = apr.toFixed(4);
        
        calculateInterest();
        updateComparisonTable();
    }
    
    // 从年利率转换
    function convertFromYearly() {
        if (!yearlyRateInput.value) {
            clearResults();
            return;
        }
        
        const yearlyRate = parseFloat(yearlyRateInput.value);
        const dailyRate = (yearlyRate / 365).toFixed(4);
        const monthlyRate = (yearlyRate / 12).toFixed(4);
        const apr = (Math.pow(1 + yearlyRate / 100 / 365, 365) - 1) * 100;
        
        dailyRateInput.value = dailyRate;
        monthlyRateInput.value = monthlyRate;
        aprInput.value = apr.toFixed(4);
        
        calculateInterest();
        updateComparisonTable();
    }
    
    // 从APR转换
    function convertFromAPR() {
        if (!aprInput.value) {
            clearResults();
            return;
        }
        
        const apr = parseFloat(aprInput.value);
        // 利用复利公式反算简单利率
        const yearlyRate = (Math.log(1 + apr / 100) * 365 / 365 * 100).toFixed(4);
        const dailyRate = (yearlyRate / 365).toFixed(4);
        const monthlyRate = (yearlyRate / 12).toFixed(4);
        
        dailyRateInput.value = dailyRate;
        monthlyRateInput.value = monthlyRate;
        yearlyRateInput.value = yearlyRate;
        
        calculateInterest();
        updateComparisonTable();
    }
    
    // 清除结果
    function clearResults() {
        dailyInterestEl.textContent = '0.00元';
        monthlyInterestEl.textContent = '0.00元';
        yearlyInterestEl.textContent = '0.00元';
        
        compDailyRateEl.textContent = '-';
        compMonthlyRateEl.textContent = '-';
        compYearlyRateEl.textContent = '-';
        compDailyInterestEl.textContent = '-';
        compYearlyInterestEl.textContent = '-';
    }
    
    // 计算利息
    function calculateInterest() {
        const principal = parseFloat(principalInput.value) || 0;
        const dailyRate = parseFloat(dailyRateInput.value) || 0;
        const monthlyRate = parseFloat(monthlyRateInput.value) || 0;
        const yearlyRate = parseFloat(yearlyRateInput.value) || 0;
        
        const dailyInterest = principal * (dailyRate / 100);
        const monthlyInterest = principal * (monthlyRate / 100);
        const yearlyInterest = principal * (yearlyRate / 100);
        
        dailyInterestEl.textContent = dailyInterest.toFixed(2) + '元';
        monthlyInterestEl.textContent = monthlyInterest.toFixed(2) + '元';
        yearlyInterestEl.textContent = yearlyInterest.toFixed(2) + '元';
        
        updateComparisonTable();
    }
    
    // 更新比较表格
    function updateComparisonTable() {
        const dailyRate = parseFloat(dailyRateInput.value) || 0;
        const monthlyRate = parseFloat(monthlyRateInput.value) || 0;
        const yearlyRate = parseFloat(yearlyRateInput.value) || 0;
        const principal = parseFloat(principalInput.value) || 0;
        
        compDailyRateEl.textContent = dailyRate.toFixed(4);
        compMonthlyRateEl.textContent = monthlyRate.toFixed(2);
        compYearlyRateEl.textContent = yearlyRate.toFixed(2);
        compDailyInterestEl.textContent = (principal * dailyRate / 100).toFixed(2) + '元';
        compYearlyInterestEl.textContent = (principal * yearlyRate / 100).toFixed(0) + '元';
    }
    
    // 初始化计算 (使用默认值)
    yearlyRateInput.value = '5.00';
    convertFromYearly();
}); 