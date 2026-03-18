/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @id70533735 (@returns) {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @id70533735 (@returns) {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @id70533735 (@returns) {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function calculateSimpleRevenue(purchase, _product) {
    const { discount, sale_price, quantity } = purchase;
    return sale_price * quantity * (1 - discount / 100);
   // @TODO: Расчёт прибыли от операции
}

function calculateBonusByProfit(index, total, seller) {
    
    const { profit } = seller;
    let percent;
    if (index === total - 1) {
        percent = 0; // последнее место
    } else if (index === 0) {
        percent = 0.15; // первое место
    } else if (index === 1 || index === 2) {
        percent = 0.10; // второе и третье место
    } else {
        percent = 0.05; // все остальные, кроме последнего
    }
    return profit * percent;
  // @TODO: Расчёт бонуса от позиции в рейтинге
}
function analyzeSalesData(data, options) {
    // Проверка входных данных
    if (!data 
        || typeof data !== 'object'
        || !Array.isArray(data.sellers) 
        || !Array.isArray(data.products) 
        || !Array.isArray(data.purchase_records)
        || data.sellers.length === 0
        || data.products.length === 0
        || data.purchase_records.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    }

    // Проверка наличия опций
    if (!options || typeof options !== 'object') {
        throw new Error('Опции должны быть объектом');
    }

    const { calculateRevenue, calculateBonus } = options;

    if (typeof calculateRevenue !== 'function' || typeof calculateBonus !== 'function') {
        throw new Error('В опциях должны быть переданы функции calculateRevenue и calculateBonus');
    }

    // Подготовка промежуточных данных
    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    }));

    // Индексация продавцов и товаров
    const sellerIndex = {};
    sellerStats.forEach(seller => {
        sellerIndex[seller.id] = seller;
    });

    const productIndex = {};
    data.products.forEach(product => {
        productIndex[product.sku] = product;
    });

    // Расчет выручки и прибыли для каждого продавца
    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id];
        if (!seller) return;

        seller.sales_count += 1;
        seller.revenue += record.total_amount;

        record.items.forEach(item => {
            const product = productIndex[item.sku];
            if (!product) return;

            const cost = product.purchase_price * item.quantity;
            const revenue = calculateRevenue(item, product);
            seller.profit += (revenue - cost);

            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            seller.products_sold[item.sku] += item.quantity;
        });
    });

    // Сортировка продавцов по прибыли
    sellerStats.sort((a, b) => b.profit - a.profit);

    // Назначение премий на основе ранжирования
    const totalSellers = sellerStats.length;
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, totalSellers, seller);

        const productsArray = Object.entries(seller.products_sold)
            .map(([sku, quantity]) =>


({ sku, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);

        seller.top_products = productsArray;
    });

    // Подготовка итоговой коллекции
    const report = sellerStats.map(seller => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: +seller.revenue.toFixed(2),
        profit: +seller.profit.toFixed(2),
        sales_count: seller.sales_count,
        top_products: seller.top_products,
        bonus: +seller.bonus.toFixed(2)
    }));

    return report;}
