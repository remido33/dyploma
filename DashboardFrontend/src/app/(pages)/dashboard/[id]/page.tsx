"use client";

import { FC, useEffect, useState } from 'react';
import Calendar from "@/components/Calendar";
import Chart from '@/components/Chart';
import styles from '@/styles/analytics.module.css';
import Table from '@/components/Table';
import nextApi from '@/utils/nextApi';
import { usePathname } from 'next/navigation';
import { AnalyticsData, ErrorType } from '@/helpers/types';
import DoughnutChart from '@/components/Doughnut';
import Analytics from './_components/Analytics';

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getLast14Days = () => {
    const now = new Date();
    const earlier14 = new Date(now);
    earlier14.setDate(now.getDate() - 13);
    return {
        startDate: `${formatDate(earlier14)} 00:00` ,
        endDate: `${formatDate(now)} 23:59` ,
    }
}

const Dashboard: FC = () => {

    const [error, setError] = useState<ErrorType | null>(null);
    const [selectedRange, setSelectedRange] = useState<{startDate: string, endDate: string}>({
        startDate: '',
        endDate: '',
    });
    const { startDate, endDate } = selectedRange;
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

    const pathname = usePathname()
    const storeId = pathname.split('/dashboard/').pop();

    const handleDateRangeChange = (start: Date, end: Date) => {
        setSelectedRange({
            startDate: `${formatDate(start)} 00:00`,
            endDate: `${formatDate(end)} 23:59`,
        });
    };

    useEffect(() => {
        if(startDate.length > 0 && endDate.length > 0 && storeId) {
            const fetchData = async () => {
                try {
                    const { data } = await nextApi.get(`/api/analytics/${storeId}?startDate=${startDate}&endDate=${endDate}`);
                    setAnalyticsData(data);
                }
                catch(err: any) {
                    const { status, message }: ErrorType = err;
                    setError({ status, message });
                }
            }
            fetchData();
        }
        else {
            setSelectedRange(getLast14Days())
        }
    }, [selectedRange]);

    useEffect(() => {
        setTimeout(() => {
            setSelectedRange(getLast14Days())
        }, 50)
    }, []);


    {/* 
    if(error) {
        throw new Error(error.message)
    };
    */}

    return (
        <div className={styles.wrapper}>
            {analyticsData && (
                <>
                    <div className={styles.calendar}>
                        <Calendar 
                            onDateRangeChange={handleDateRangeChange} 
                        />
                    </div>
                    <Analytics 
                        analyticsData={analyticsData} 
                    /> 
                </>
            )}
        </div>
    )
};

export default Dashboard;