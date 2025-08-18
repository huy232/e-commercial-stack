"use client"

import React, { useEffect, useState } from "react"
import { Line, Pie, Bar } from "react-chartjs-2" // Import different chart types
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ArcElement, // For Pie chart
	BarElement, // For Bar chart
} from "chart.js"
import clsx from "clsx"

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	BarElement
)

// Updated interface for handling both MonthlyOrderData and generic data for pie chart
interface MonthlyOrderData {
	month: number
	value: number
}

interface DatasetConfig {
	label: string
	color: string | string[] // Support multiple colors for pie chart
	data: MonthlyOrderData[] | number[] // Generic data array for pie charts
}

interface OrdersChartProps {
	datasets: DatasetConfig[] // Array of datasets, each with its label, color, and data
	labels?: string[] // For pie charts, pass category labels separately
	chartTitle: string
	chartType?: "line" | "pie" | "bar" // Allow different chart types
	className?: string
}

const OrdersChart: React.FC<OrdersChartProps> = ({
	datasets,
	labels, // Optional for pie charts
	chartTitle,
	chartType = "line",
	className,
}) => {
	const [chartData, setChartData] = useState<any>(null)
	useEffect(() => {
		// If it's a pie chart, the data structure is different
		if (chartType === "pie" && labels) {
			const preparedData = {
				labels, // Category names (product types)
				datasets: datasets.map((dataset) => ({
					label: dataset.label,
					data: dataset.data as number[], // For pie, it's an array of counts (numbers)
					backgroundColor: dataset.color as string[], // For pie, it can be an array of colors
				})),
			}

			setChartData(preparedData)
		} else {
			// For line and bar charts, handle data the same way as before
			const labels = datasets[0].data.map((data) =>
				typeof data === "object" ? `Month ${data.month}` : ""
			)

			const preparedData = {
				labels,
				datasets: datasets.map((dataset) => ({
					label: dataset.label,
					data: (dataset.data as MonthlyOrderData[]).map((data) =>
						typeof data === "object" ? data.value : 0
					),
					borderColor: dataset.color as string,
					backgroundColor: `${dataset.color}33`, // Apply transparency to the background color
					fill: true,
					tension: 0.1,
				})),
			}

			setChartData(preparedData)
		}
	}, [datasets, labels, chartType])

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: chartTitle,
			},
		},
	}

	// Render the appropriate chart type
	const renderChart = () => {
		if (!chartData) return null
		switch (chartType) {
			case "pie":
				return (
					<Pie
						data={chartData}
						options={chartOptions}
						className={clsx(className)}
					/>
				)
			case "bar":
				return (
					<Bar
						data={chartData}
						options={chartOptions}
						className={clsx(className)}
					/>
				)
			case "line":
			default:
				return (
					<Line
						data={chartData}
						options={chartOptions}
						className={clsx(className)}
					/>
				)
		}
	}

	return renderChart()
}

export default OrdersChart
