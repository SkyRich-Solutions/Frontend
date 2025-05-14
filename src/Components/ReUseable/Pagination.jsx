import React from 'react';

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages === 0) return null;

    const goToPrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className='mt-4 flex justify-center items-center gap-4'>
            <button
                onClick={goToPrev}
                disabled={currentPage === 1}
                className='text-white px-4 py-2 rounded bg-gray-700 disabled:opacity-50'
            >
                Prev
            </button>
            <span className='text-white font-semibold'>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className='text-white px-4 py-2 rounded bg-gray-700 disabled:opacity-50'
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
