"use client";

import { FC, useEffect, useState } from "react";
import styles from '@/styles/chart.module.css';
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import clsx from "clsx";
import ChartError from "./ChartError";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);


type Props = {
    title: string,
    subtitle: string,
    data: any,
    labels: {
        key: string,
        title: string
    }[],
};


function formatDateToLocal(dayDiff: number, dateString: string) {
    const date = new Date(dateString);
    const optionsDate: any = { month: 'short', day: 'numeric' };
    const optionsDateTime: any = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',  hour12: false };
    
    return date.toLocaleDateString('en-US', dayDiff > 2 ? optionsDate : optionsDateTime)
}

const colors = [
    "rgb(90, 120, 255)",
    "rgb(65, 223, 34)",
];

const Chart: FC<Props> = ({ title, subtitle, data: passedData, labels, }) => {

    const [totalVisible, setTotalVisible] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [data, setData] = useState(passedData);

    useEffect(() => {
        setIsMobile(window.innerWidth < 700);
        setData(passedData);
    }, [passedData]);

    const defaultOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: isMobile ? .4 : .6,
        elements: {
            bar: {
                borderRadius: 2,
            },
        },
        scales: {
            y: {
                ticks: {
                    maxTicksLimit: 7,
                    crossAlign: 'far',
                    color: '#8d8d8d',
                    font: {
                        size: 14,
                        weight: 400,
                    },
                    padding: isMobile ? 4 : 8,
                },
                border: {
                    display: false,
                },
                grid: {
                    color: '#eaeaea',
                },
            },
            x: {
                ticks: {
                    maxTicksLimit: isMobile ? 3 : 6,
                    color: '#8d8d8d',
                    font: {
                        size: 13,
                        weight: 400,
                    },
                    padding: 4,
                },
                border: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
                callbacks: {
                    label: (context: any) => {
    
                        const { formattedValue, label } = context;
                      
                        return (
                            `<div style="padding: 6px 12px 8px;">
                                <span style="color: var(--gray-300);">${label} -</span>
                                <span style="font-weight: 500; font-size: 13px">Count: ${formattedValue}</span>
                            </div>`
                        )
                    },
                },
                external: (context: any) => {
                    let tooltipEl = document.getElementById('chartjs-tooltip');
            
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.className = styles.tooltip;
                        tooltipEl.innerHTML = '<table></table>';
                        document.body.appendChild(tooltipEl);
                    }
            
                    const tooltipModel = context.tooltip;
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        tooltipEl.style.left = '0';
                        return;
                    }
            
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }
                    
                    if (tooltipModel.body) {
                        tooltipEl.innerHTML = `
                            <div>${tooltipModel.body[0].lines[0]}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M5 6L0.669873 0.75L9.33013 0.750001L5 6Z" fill="white"/>
                            </svg>
                        `;
                    }
            
                    const position = context.chart.canvas.getBoundingClientRect();
                    const index = tooltipModel.dataPoints[0].dataIndex;
                    const chart = context.chart;
                    const yScale = chart.scales.y;
                    const xScale = chart.scales.x;
            
                    // Get the base position of the bar on the x-axis
                    const barBase = xScale.getPixelForValue(context.chart.data.labels[index]);
            
                    // Determine if chart is stacked by checking the presence of stacked options
                    const stacked = chart.options.scales.y.stacked || chart.options.scales.x.stacked;
                    
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
    
                    if (stacked) {
                        let stackedHeight = 0;
                        chart.data.datasets.forEach((dataset: any) => {
                            const barHeight = yScale.getPixelForValue(dataset.data[index]);
                            stackedHeight += (yScale.getPixelForValue(0) - barHeight);
                        });
            
                        tooltipEl.style.left = position.left + window.pageXOffset + barBase - (tooltipEl.clientWidth / 2) + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + (yScale.getPixelForValue(0) - stackedHeight) - tooltipEl.clientHeight - 12 + 'px';
                    } else {
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - (tooltipEl.clientWidth / 2) + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - tooltipEl.clientHeight - 12 + 'px';
                    }
                },
            },
        },
    };
    
    const stackedOptions: any = {
        ...defaultOptions,
        scales: {
            x: { 
                stacked: true,
                ...defaultOptions.scales.x,
            },
            y: { 
                stacked: true,
                ...defaultOptions.scales.y,
            }
        },
        plugins: {
            ...defaultOptions.plugins,
            tooltip: {
                ...defaultOptions.plugins.tooltip,
                callbacks: {
                    label: (context: any) => {
                        const datasets = context.chart.data.datasets;
                        const index = context.dataIndex;
                        const values = datasets.map((dataset: any) => dataset.data[index]);
                        const total = values.reduce((sum: number, value: number) => sum + value, 0);
                        
                        const labels = context.chart.data.datasets.map((dataset: any, i: number) => {
                            return `
                                <li>
                                    <span>${dataset.label.toLowerCase()}</span>
                                    <span>${values[i].toLocaleString('en-US')}</span>
                                </li>`;
                        }).join('');
                        
                        return `
                            <div style="width: ${isMobile ? '98px' : '160px'}">
                                <div style="color: #fff; font-family: var(--font-mulish); font-size: 12px; border-bottom: 1px solid var(--gray-400); padding: 6px 12px;">${context.label}</div>
                                <ul>
                                    ${labels}
                                    <li>
                                        <span>Total</span>
                                        <span>${total.toLocaleString('en-US')}</span>
                                    </li>
                                </ul>
                            </div>
                        `;
                    }
                }
            }
        }
    };

    if(data?.error || !data || data.length === 0) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h3>
                        {title}
                    </h3>
                    <p>
                        {subtitle}
                    </p>
                </div>
                <div className={styles.body}> 
                    <ChartError 
                        isError={!!(passedData?.error || !data)} 
                    />
                </div>
            </div>
        )
    };

    const startDateObj = new Date(data[0].date);
    const endDateObj = new Date(data[data.length - 1].date);

    const dayDiff = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));

    const chartData = {
        labels: data.map((item: any) => formatDateToLocal(dayDiff, item.date)),
        datasets: labels.map(({ title, key }, index) => ({
            label: title,
            data: data.map((item: any) => parseInt(item[key])),
            backgroundColor: index === 0 ? 'rgb(120, 120, 255)' : 'rgb(120, 220, 100)',
        })),
    };

    const options = data.length > 16 ? stackedOptions : defaultOptions;

    const getTotal = (key: string) => {
        return data.reduce((total: number, item: any) => {
            return total + (parseInt(item[key]) || 0);
        }, 0);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3>
                    {title}
                </h3>
                <p>
                    {subtitle}
                </p>
            </div>
            <div className={styles.body}>
                <div className={styles.indicators}>
                    {labels.map((label, index) => {
                        return (
                            <div key={index} className={styles.indicator}>
                                <div 
                                    style={{ background: colors[index]}} 
                                    className={styles.circle} 
                                />
                                <span>{label.title}</span>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.chart}>
                    <div className={styles.canvas}>
                        <Bar
                            options={options}
                            data={chartData}
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <button onClick={() => setTotalVisible((prev) => !prev)} className={styles.footerTitle}>
                        {totalVisible ? 'Hide' : 'Show'} total
                    </button>
                    {totalVisible && (
                        <ul>
                            {labels.map((label) => {
                                return (
                                    <li>
                                        <span>{label.title}</span>
                                        <b>{getTotal(label.key)}</b>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
            
        </div>
    );
}

export default Chart;
