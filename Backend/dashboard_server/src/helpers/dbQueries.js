const queries = {
    analytics: {
        actionsDaily: `
            WITH date_series AS (
                SELECT generate_series(
                    $2::timestamp AT TIME ZONE 'UTC', 
                    ($3::timestamp AT TIME ZONE 'UTC') + interval '1 day' - interval '1 second', 
                    '1 day'
                )::date AS date
            ),
            counts AS (
                SELECT DATE(timestamp AT TIME ZONE 'UTC') AS date, platform_id, COUNT(*) AS count
                FROM analytics
                WHERE store_id = $1 
                AND timestamp BETWEEN $2 AND $3 
                AND action_id = $4
                GROUP BY DATE(timestamp AT TIME ZONE 'UTC'), platform_id
            )
            SELECT 
                date_series.date AS date,
                COALESCE(SUM(counts.count), 0) AS total_count,
                COALESCE(SUM(CASE WHEN counts.platform_id = 1 THEN counts.count ELSE 0 END), 0) AS ios,
                COALESCE(SUM(CASE WHEN counts.platform_id = 2 THEN counts.count ELSE 0 END), 0) AS android
            FROM 
                date_series
            LEFT JOIN 
                counts ON date_series.date = counts.date
            GROUP BY 
                date_series.date
            ORDER BY 
                date_series.date;
        `,
        actionsHourly: `
            WITH hour_series AS (
                SELECT generate_series(
                    $2::timestamp AT TIME ZONE 'UTC', 
                    ($3::timestamp AT TIME ZONE 'UTC') + interval '1 hour' - interval '1 second', 
                    '1 hour'
                )::timestamp AS hour
            ),
            counts AS (
                SELECT DATE_TRUNC('hour', timestamp AT TIME ZONE 'UTC') AS hour, platform_id, COUNT(*) AS count
                FROM analytics
                WHERE store_id = $1 
                AND timestamp BETWEEN $2 AND $3 
                AND action_id = $4
                GROUP BY DATE_TRUNC('hour', timestamp AT TIME ZONE 'UTC'), platform_id
            )
            SELECT 
                hour_series.hour AS date,
                COALESCE(SUM(counts.count), 0) AS total_count,
                COALESCE(SUM(CASE WHEN counts.platform_id = 1 THEN counts.count ELSE 0 END), 0) AS ios,
                COALESCE(SUM(CASE WHEN counts.platform_id = 2 THEN counts.count ELSE 0 END), 0) AS android
            FROM 
                hour_series
            LEFT JOIN 
                counts ON hour_series.hour = counts.hour
            GROUP BY 
                hour_series.hour
            ORDER BY 
                hour_series.hour;
        `,
        popular: `
            SELECT product_id AS value, COUNT(*) AS count
            FROM analytics
            WHERE store_id = $1 
            AND timestamp BETWEEN $2 AND $3 
            AND action_id = $4
            GROUP BY product_id
            ORDER BY count DESC
            LIMIT 20;
        `,
        terms: `
            SELECT term AS value, COUNT(*) AS count
            FROM terms
            WHERE store_id = $1
            AND timestamp BETWEEN $2 AND $3
            GROUP BY term
            ORDER BY count DESC
            LIMIT 20;
        `,
        purchasesDaily: `
            WITH date_series AS (
                SELECT generate_series(
                    $2::timestamp AT TIME ZONE 'UTC', 
                    ($3::timestamp AT TIME ZONE 'UTC') + interval '1 day' - interval '1 second', 
                    '1 day'
                )::date AS date
            ),
            counts AS (
                SELECT 
                    DATE(p.timestamp AT TIME ZONE 'UTC') AS date, 
                    COUNT(DISTINCT p.id) AS purchases_count, 
                    COUNT(pp.product_id) AS purchased_products_total
                FROM purchases p
                LEFT JOIN purchase_products pp ON p.id = pp.purchase_id
                WHERE p.store_id = $1 
                AND p.timestamp BETWEEN $2 AND $3
                GROUP BY DATE(p.timestamp AT TIME ZONE 'UTC')
            )
            SELECT 
                date_series.date AS date,
                COALESCE(SUM(counts.purchases_count), 0) AS purchases_count,
                COALESCE(SUM(counts.purchased_products_total), 0) AS purchased_products_total
            FROM 
                date_series
            LEFT JOIN 
                counts ON date_series.date = counts.date
            GROUP BY 
                date_series.date
            ORDER BY 
                date_series.date;
        `,

        purchasesHourly: `
            WITH hour_series AS (
                SELECT generate_series(
                    $2::timestamp AT TIME ZONE 'UTC', 
                    ($3::timestamp AT TIME ZONE 'UTC') + interval '1 hour' - interval '1 second', 
                    '1 hour'
                )::timestamp AS hour
            ),
            counts AS (
                SELECT 
                    DATE_TRUNC('hour', p.timestamp AT TIME ZONE 'UTC') AS hour, 
                    COUNT(DISTINCT p.id) AS purchases_count, 
                    COUNT(pp.product_id) AS purchased_products_total
                FROM purchases p
                LEFT JOIN purchase_products pp ON p.id = pp.purchase_id
                WHERE p.store_id = $1 
                AND p.timestamp BETWEEN $2 AND $3
                GROUP BY DATE_TRUNC('hour', p.timestamp AT TIME ZONE 'UTC')
            )
            SELECT 
                hour_series.hour AS date,
                COALESCE(SUM(counts.purchases_count), 0) AS purchases_count,
                COALESCE(SUM(counts.purchased_products_total), 0) AS purchased_products_total
            FROM 
                hour_series
            LEFT JOIN 
                counts ON hour_series.hour = counts.hour
            GROUP BY 
                hour_series.hour
            ORDER BY 
                hour_series.hour;
        `,
    }
}

module.exports = queries;
