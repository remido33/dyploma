import Table from "@/components/Table";
import Chart from '@/components/Chart';
import { FC } from "react";
import styles from '@/styles/analytics.module.css';
import { AnalyticsData } from "@/helpers/types";

type AnalyticsProps = {
    analyticsData: AnalyticsData,
}

const Analytics: FC<AnalyticsProps> = ({ analyticsData }) => {

    const { views, viewsPop, atc, atcPop, terms, purchases } = analyticsData;

    return (
        <>
            <section>
                <h2>Data Overview</h2>
                <div className={styles.chart}>
                    <Chart
                        title='Product Views'
                        subtitle='Total views of products over time'
                        data={views}
                        labels={[
                            { key: 'ios', title: 'Ios' },
                            { key: 'android', title: 'Android' },
                        ]}
                    />
                </div>
                <div className={styles.row}>
                    <Table
                        title='Top Viewed Products'
                        valueLabel='Views'
                        data={viewsPop}
                        productTypeAnalytic={true}
                    />
                    <Table
                        title='Most Searched Terms'
                        valueLabel='count'
                        data={terms}
                    />
                </div>
            </section>
            <section>
                <h2>Purchase Insights</h2>
                <div className={styles.chart}>
                    <Chart
                        title='Completed Purchases'
                        subtitle='Number of products purchased'
                        data={purchases}
                        labels={[
                            { key: "purchases_count", title: "Purchases count"},
                            { key: "purchased_products_total", title: "Products total"}
                        ]}
                    />
                </div>

                <div className={styles.chart}>
                    <Chart
                        labels={[
                            { key: 'ios', title: 'Ios'},
                            { key: 'android', title: 'Android' },
                        ]}
                        title='Add to Cart Actions'
                        subtitle='Tracking the number of products added to cart'
                        data={atc}
                    />
                </div>
                <div className={styles.row}>
                    <Table
                        title='Most Added to Cart'
                        valueLabel='count?'
                        data={atcPop}
                        productTypeAnalytic={true}
                    />
                </div>
            </section>
        </>
    )
};

export default Analytics;