import { useCallback, useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

import useHttp from '../../../../hooks/useHttp';
import orderOptions from '../../../../utils/orderOptions';
import { useAppSelector } from '../../../../hooks/reduxHooks';


import classes from './CategoriesChart.module.css';

Chart.register(...registerables);

const CategoriesChart: React.FC = () => {
    const { sendRequest } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dataLabels, setDataLabels] = useState<string[]>([]);
    const [categoriesCount, setCategoriesCount] = useState<number[]>([]);

    const processResponse = useCallback((res: { category: number }) => {
        Object.entries(res).forEach(([k, v]) => {
            setDataLabels(oldState => [...oldState, k]);
            setCategoriesCount(oldState => [...oldState, v]);
        });
    }, []);

    useEffect(() => {
        if (!restaurant._id) { return };
        sendRequest(orderOptions.getOrdersCountByCategory(restaurant._id), processResponse);
    }, [sendRequest, restaurant._id, processResponse]);


    useEffect(() => {
        console.log(dataLabels);

        const myChart = new Chart(
            canvasRef.current!,
            {
                type: 'pie',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'Categories',
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
                          }
                    }
                }
            }
        );
        return () => {
            myChart.destroy();
        }
    }, [categoriesCount, dataLabels])
    return (
        <div className={classes.chart}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
};

export default CategoriesChart;