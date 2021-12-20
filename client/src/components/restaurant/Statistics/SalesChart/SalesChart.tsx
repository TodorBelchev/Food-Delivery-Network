import React, { useCallback, useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

import useHttp from '../../../../hooks/useHttp';
import orderOptions from '../../../../utils/orderOptions';
import { useAppSelector } from '../../../../hooks/reduxHooks';


import classes from './SalesChart.module.css';


const SalesChart: React.FC = () => {
    const { sendRequest } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [period, setPeriod] = useState('week');
    const [dataLabels, setDataLabels] = useState<string[]>([]);
    const [categoriesCount, setCategoriesCount] = useState<number[]>([]);

    const processResponse = useCallback((res: { category: number }) => {
        const labels: string[] = [];
        const counts: number[] = [];
        Object.entries(res).forEach(([k, v]) => {
            labels.push(k);
            counts.push(v);
        });
        setDataLabels(labels);
        setCategoriesCount(counts);
    }, []);

    useEffect(() => {
        if (!restaurant._id) { return };
        sendRequest(orderOptions.getSalesByPeriod(restaurant._id, period), processResponse);
    }, [sendRequest, restaurant._id, processResponse, period]);


    useEffect(() => {
        if (dataLabels.length === 0) { return; }
        const myChart = new Chart(
            canvasRef.current!,
            {
                type: 'bar',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'Sales',
                        data: categoriesCount,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 71, 0.2)',
                            'rgba(238, 130, 238, 0.2)',
                            'rgba(255, 0, 0, 0.2)',
                            'rgba(0, 0, 255, 0.2)',
                            'rgba(255, 99, 71, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgb(255, 99, 71, 1)',
                            'rgb(238, 130, 238, 1)',
                            'rgb(255, 0, 0, 1)',
                            'rgb(0, 0, 255, 1)',
                            'rgba(255, 99, 71, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Orders by category'
                        },
                    },
                }
            }
        );
        return () => {
            myChart.destroy();
        }
    }, [categoriesCount, dataLabels]);

    const selectChangeHandler = (e: React.ChangeEvent) => {
        const period = (e.target as HTMLSelectElement).selectedOptions[0].value
        setPeriod(period);
    };

    return (
        <div className={classes.chart}>
            <h2 className={classes['chart-title']}>Sales:</h2>
            <select onChange={selectChangeHandler} className={classes['chart-select']}>
                <option value="week">Week</option>
                <option value="month">Month</option>
            </select>
            {dataLabels.length > 0 && <canvas ref={canvasRef} className={classes['canvas']}></canvas>}
            {dataLabels.length === 0 && <div className={classes['no-data']}>No data for selected period</div>}
        </div >
    )
};

export default SalesChart;