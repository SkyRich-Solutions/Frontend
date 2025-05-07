import React from 'react';

const COLORS = [
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(75, 192, 75, 0.6)',
    'rgba(0, 128, 128, 0.6)',
    'rgba(255, 140, 0, 0.6)',
    'rgba(106, 90, 205, 0.6)',
    'rgba(199, 21, 133, 0.6)',
    'rgba(100, 149, 237, 0.6)',
    'rgba(0, 206, 209, 0.6)',
    'rgba(46, 139, 87, 0.6)',
    'rgba(220, 20, 60, 0.6)',
    'rgba(244, 164, 96, 0.6)',
];

const CategorySelectionLegend = ({ uniqueCategories, selectedCategory, setSelectedCategory }) => {
    return (
        <>
            {uniqueCategories.map((category, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-4 font-bold text-white rounded-lg transition text-center break-words ${
                        selectedCategory === category ? 'ring-4 ring-gray-400' : ''
                    }`}
                    style={{
                        backgroundColor: COLORS[index % COLORS.length],
                        width: '47%',
                        minHeight: '4rem',
                    }}
                >
                    {category}
                </button>
            ))}
        </>
    );
};


export default CategorySelectionLegend;
