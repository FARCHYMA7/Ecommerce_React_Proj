/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { useGetReportQuery } from '../../redux/api/orderAPI';
import FullScreenLoader from '../../components/FullScreenLoader';
import { Col, Row } from 'reactstrap';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController
);

const ReportPage = () => {
    const { data: reportData, isLoading, refetch } = useGetReportQuery();
    const [generalXAxis, setGeneralXAxis] = useState([]);
    const [generalOrderCount, setGeneralOrderCount] = useState([]);
    const [generalOrderPrice, setGeneralOrderPrice] = useState([]);

    const [monthlyXAxis, setMonthlyXAxis] = useState([]);
    const [monthlyOrderCount, setMonthlyOrderCount] = useState([]);
    const [monthlyOrderPrice, setMonthlyOrderPrice] = useState([]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (reportData && reportData.report && reportData.report.length > 0) {
            const xAxisList = reportData.report.map(report => report.userName);
            const countList = reportData.report.map(report => report.orderCount);
            const priceList = reportData.report.map(report => report.totalOrderPrice);

            setGeneralXAxis(xAxisList);
            setGeneralOrderCount(countList);
            setGeneralOrderPrice(priceList);
        }

        if (reportData && reportData.reportMonth && reportData.reportMonth.length > 0) {
            const xAxisList = reportData.reportMonth.map(report => `${report.userName} (${report.yearMonth})`);
            const countList = reportData.reportMonth.map(report => report.orderCount);
            const priceList = reportData.reportMonth.map(report => report.totalOrderPrice);

            setMonthlyXAxis(xAxisList);
            setMonthlyOrderCount(countList);
            setMonthlyOrderPrice(priceList);
        }
    }, [reportData]);

    const generalData = {
        labels: generalXAxis,
        datasets: [
            {
                label: 'Order Count',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: generalOrderCount,
            },
            {
                label: 'Order Price',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: generalOrderPrice,
            },
        ],
    };

    const monthlyData = {
        labels: monthlyXAxis,
        datasets: [
            {
                label: 'Order Count',
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                data: monthlyOrderCount,
            },
            {
                label: 'Order Price',
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                data: monthlyOrderPrice,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div className="main-board">
            <div className="container">
                <Row className="mb-3">
                    <Col>
                        <h3 className='report-title'>General Report</h3>
                    </Col>
                </Row>
                <div className="chart-container mt-1 mb-5" style={{ height: '400px' }}>
                    <Bar
                        data={generalData}
                        options={{
                            ...options,
                            maintainAspectRatio: false
                        }}
                    />
                </div>

                <Row className="mb-3">
                    <Col>
                        <h3 className='report-title'>Monthly Report</h3>
                    </Col>
                </Row>
                <div className="chart-container mt-1" style={{ height: '400px' }}>
                    <Bar
                        data={monthlyData}
                        options={{
                            ...options,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ReportPage;
