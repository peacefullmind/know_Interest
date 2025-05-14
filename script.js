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
    const positionIndicatorEl = document.getElementById('input-position-indicator');
    
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
        
        // 清除位置指示器
        positionIndicatorEl.className = 'position-indicator';
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
        
        // 更新位置指示器
        updatePositionIndicator(yearlyRate);
    }
    
    // 更新位置指示器
    function updatePositionIndicator(yearlyRate) {
        // 利率档位（按1万元年利息从小到大排序）
        const rateThresholds = [
            0.25,  // 银行活期 (25元)
            1.87,  // 余额宝 (187元)
            2.00,  // 银行定期 (200元)
            3.65,  // 早期余额宝 (365元)
            15.40, // 司法保护上限 (1540元)
            36.00, // 高利贷红线 (3600元)
            109.50, // 日息0.3% (10950元)
            365.00  // 日息1% (36500元)
        ];
        
        // 清除之前的类名
        positionIndicatorEl.className = 'position-indicator';
        
        // 如果没有有效利率，不显示指示器
        if (!yearlyRate) return;
        
        // 确定位置
        let position = 'above'; // 默认高于所有值
        
        for (let i = 0; i < rateThresholds.length; i++) {
            if (yearlyRate < rateThresholds[i]) {
                position = 'below';
                break;
            }
        }
        
        // 添加对应的类
        positionIndicatorEl.classList.add(position);
        
        // 添加文字提示
        if (position === 'above') {
            positionIndicatorEl.title = '您的利率高于所有参考产品';
        } else if (yearlyRate < rateThresholds[0]) {
            positionIndicatorEl.title = '您的利率低于银行活期存款';
        } else {
            // 找出比用户输入低的最高档位
            let lowerIndex = 0;
            for (let i = 0; i < rateThresholds.length; i++) {
                if (yearlyRate >= rateThresholds[i]) {
                    lowerIndex = i;
                } else {
                    break;
                }
            }
            
            // 根据档位显示不同的提示
            const messages = [
                '您的利率高于银行活期存款',
                '您的利率高于余额宝',
                '您的利率高于银行定期存款',
                '您的利率高于早期余额宝',
                '您的利率高于司法保护上限，注意法律风险！',
                '您的利率高于高利贷红线，可能涉嫌违法！',
                '您的利率高于日息0.3%的现金贷，非常高了！',
                '您的利率高于日息1%的现金贷，极度危险！'
            ];
            
            positionIndicatorEl.title = messages[lowerIndex];
        }
    }
    
    // 初始化计算 (使用默认值)
    yearlyRateInput.value = '5.00';
    convertFromYearly();
}); 