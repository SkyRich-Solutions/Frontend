import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line
} from 'recharts';
import TurbineData from '../MockData/TurbineData.json';

const ChartComponent = ({ type }) => {
    // Ensure that the JSON data has the correct format
    const formattedData = TurbineData.map((turbine) => ({
        model: turbine.TurbineModel,
        nominal_power: parseFloat(
            turbine.NominalPower.replace(' KW', '').replace(',', '.')
        )
    }));

    if (type === 'bar') {
        return (
            <div className='w-full h-full p-4  shadow-md rounded-lg overflow-hidden'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey='model' />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey='nominal_power' fill='#00b0ad' />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line') {
        return (
            <div className='w-full h-full p-4 shadow-md rounded-lg overflow-hidden'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey='model' />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type='monotone'
                                dataKey='nominal_power'
                                stroke='#00b0ad'
                                // stroke='#5a4673'
                            />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    return null;
};

export default ChartComponent;
