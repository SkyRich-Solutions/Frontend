import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../Components/ReUseable/Loader';
import Pagination from '../Components/ReUseable/Pagination';
import {
    CircleAlertIcon,
    CircleCheckBigIcon,
    WandSparklesIcon
} from 'lucide-react';

const UploadPage = () => {
    const rowsPerPage = 18;
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [response, setResponse] = useState(null);
    const [output, setOutput] = useState('');
    const [UnprocessedData, setUnprocessedData] = useState([]);
    const [UnProcessedPage, setUnProcessedPage] = useState(1);
    const [ProcessedData, setProcessedData] = useState([]);
    const [ProcessedPage, setProcessedPage] = useState(1);

    const [Uploading, setUploading] = useState(false);
    const [Cleaning, setCleaning] = useState(false);
    const [error, setError] = useState(null);

    const headerMap = {
        // Material

        ViolationReplacementPart: 'Violation (Part)',
        UnknownMaintPlant: 'Maint. Plant Unknown',
        UnknownPlanningPlant: 'Planning Plant Unknown',
        UnknownLocation: 'Location Unknown',
        PlantSpecificMaterialStatus: 'Status',
        BatchManagementPlant: 'Batch Managed',
        Serial_No_Profile: ' Serial No. Profile',
        ReplacementPart: 'Replacement Part',
        UsedInSBom: 'Used in S-BOM'

        // Add more mappings as needed
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setResponse(null);
        setError(null);

        if (selectedFile) {
            const lowerName = selectedFile.name.toLowerCase();
            if (lowerName.includes('material')) {
                setFileType('material');
            } else if (lowerName.includes('turbine')) {
                setFileType('turbine');
            } else {
                setFileType(null);
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setCleaning(false); // Prevent accidental overlap

        try {
            const res = await axios.post(
                'http://localhost:4000/api/uploadFile',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setResponse(res.data.message);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
            setResponse(null);
        } finally {
            setUploading(false);
        }
    };

    const fetchData = async () => {
        try {
            const tryFetch = async (type) => {
                const apiPrefix = type === 'material' ? 'Material' : 'Turbine';
                const [unprocessedRes, processedRes] = await Promise.all([
                    axios.get(
                        `http://localhost:4000/api/fetch_Unprocessed${apiPrefix}Data`
                    ),
                    axios.get(
                        `http://localhost:4000/api/fetch_Processed${apiPrefix}Data`
                    )
                ]);
                setFileType(type); // Set detected type
                setUnprocessedData(unprocessedRes.data.data);
                setProcessedData(processedRes.data.data);
                console.log(processedRes.data.data);
            };

            if (fileType) {
                await tryFetch(fileType);
            } else {
                // Try both if no type is defined
                try {
                    await tryFetch('material');
                } catch {
                    await tryFetch('turbine');
                }
            }
        } catch (err) {
            setError('Error fetching data.');
            console.error(err);
        }
    };

    const handleRunScript = async () => {
        setCleaning(true);
        setUploading(false); // Prevent overlap
        setError(null);
        setOutput('');

        try {
            const response = await axios.post(
                'http://localhost:4000/api/run-python-both',
                {},
                { withCredentials: true }
            );

            if (response.data) {
                await fetchData();
                setOutput('Data cleaned successfully ✅');
            } else if (response.data.error) {
                console.error('Error from script:', response.data.error);
            }
        } catch (error) {
            console.error('Error calling backend:', error);
            setError('Error running both scripts.');
        } finally {
            setTimeout(() => {
                setCleaning(false);
            }, 2000);
        }
    };

    // Paginated slices
    const paginatedUnprocessed = UnprocessedData.slice(
        (UnProcessedPage - 1) * rowsPerPage,
        UnProcessedPage * rowsPerPage
    );

    const paginatedProcessed = ProcessedData.slice(
        (ProcessedPage - 1) * rowsPerPage,
        ProcessedPage * rowsPerPage
    );

    return (
        <div className='flex-1 overflow-auto z-10 min-h-screen space-y-4'>
            <div>
                {/* <Header title='CSV Upload Dashboard' /> */}
                <div className='bg-gray-900 p-8 rounded-xl shadow-xl text-center flex items-center justify-between'>
                    <h1 className='text-white text-2xl font-semibold'>
                        CSV Upload Dashboard
                    </h1>
                    <div>
                        <form
                            onSubmit={handleUpload}
                            className='flex gap-2 justify-center'
                        >
                            <input
                                type='file'
                                accept='.csv'
                                onChange={handleFileChange}
                                className='p-2 border border-gray-600 bg-gray-700 text-white rounded'
                            />
                            <button
                                type='submit'
                                disabled={Uploading || Cleaning}
                                className={`w-32 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded 
                                ${
                                    Uploading || Cleaning
                                        ? 'bg-blue-500 cursor-not-allowed opacity-50'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {Uploading ? <Loader upload /> : 'Upload'}
                            </button>
                        </form>

                        {response && (
                            <div className='mt-3 text-green-400 flex gap-1 justify-center'>
                                <b>Success</b>
                                <CircleCheckBigIcon />
                            </div>
                        )}

                        {error && (
                            <div className='mt-3 text-red-400 flex gap-1 justify-center'>
                                <b>{error}</b>
                                <CircleAlertIcon />
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={handleRunScript}
                            disabled={Uploading || Cleaning}
                            className={`w-42 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded whitespace-nowrap
                                ${
                                    Uploading || Cleaning
                                        ? 'bg-blue-500 cursor-not-allowed opacity-50'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            <WandSparklesIcon className='w-5 h-5' />
                            Clean Data
                        </button>
                    </div>
                </div>
                {!Uploading && (
                    <>
                        <h1 className='text-white text-2xl font-semibold text-center p-2'>
                            {output}
                        </h1>
                        {Cleaning ? (
                            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                                <Loader />
                            </div>
                        ) : (
                            <>
                                <div className='flex item-center justify-center'>
                                    <h2 className='text-xl w-1/2 font-bold text-center mb-2'>
                                        Unprocessed Data
                                    </h2>
                                    <h2 className='text-xl w-1/2 font-bold text-center mb-2'>
                                        Processed Data
                                    </h2>
                                </div>
                                <div className='flex w-full justify-center gap-4 overflow-x-auto py-4 px-4'>
                                    {[
                                        {
                                            title: 'Unprocessed',
                                            data: paginatedUnprocessed,
                                            allData: UnprocessedData,
                                            page: UnProcessedPage,
                                            setPage: setUnProcessedPage
                                        },
                                        {
                                            title: 'Processed',
                                            data: paginatedProcessed,
                                            allData: ProcessedData,
                                            page: ProcessedPage,
                                            setPage: setProcessedPage
                                        }
                                    ].map(
                                        (
                                            {
                                                title,
                                                data,
                                                allData,
                                                page,
                                                setPage
                                            },
                                            index
                                        ) => (
                                            <div
                                                key={index}
                                                className='w-[50%] h-full overflow-auto'
                                            >
                                                <div className='overflow-x-auto max-h-[715px]'>
                                                    <table className='table-auto w-full h-full'>
                                                        <thead className='sticky top-0 z-10 bg-gray-700 text-white'>
                                                            <tr>
                                                                {allData.length >
                                                                    0 &&
                                                                    Object.keys(
                                                                        allData[0]
                                                                    ).map(
                                                                        (
                                                                            key
                                                                        ) => (
                                                                            <th
                                                                                key={
                                                                                    key
                                                                                }
                                                                                className='px-4 py-2 text-sm font-semibold text-left whitespace-nowrap'
                                                                            >
                                                                                {headerMap[
                                                                                    key
                                                                                ] ||
                                                                                    key}
                                                                            </th>
                                                                        )
                                                                    )}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.map(
                                                                (
                                                                    item,
                                                                    rowIndex
                                                                ) => {
                                                                    const shouldHighlight =
                                                                        title ===
                                                                            'Processed' &&
                                                                        ((fileType ===
                                                                            'material' &&
                                                                            item.ViolationReplacementPart ===
                                                                                '1') ||
                                                                            (fileType ===
                                                                                'turbine' &&
                                                                                (item.UnknownMaintPlant ===
                                                                                    '1' ||
                                                                                    item.UnknownPlanningPlant ===
                                                                                        '1' ||
                                                                                    item.UnknownLocation ===
                                                                                        '1')));

                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                rowIndex
                                                                            }
                                                                            className={`text-sm ${
                                                                                shouldHighlight
                                                                                    ? 'bg-red-500 text-white font-bold'
                                                                                    : rowIndex %
                                                                                          2 ===
                                                                                      0
                                                                                    ? 'bg-gray-800'
                                                                                    : 'bg-transparent'
                                                                            } hover:bg-cyan-800 transition-colors`}
                                                                        >
                                                                            {Object.values(
                                                                                item
                                                                            ).map(
                                                                                (
                                                                                    value,
                                                                                    cellIndex
                                                                                ) => (
                                                                                    <td
                                                                                        key={
                                                                                            cellIndex
                                                                                        }
                                                                                        className='px-4 py-2 text-left max-w-[150px] truncate'
                                                                                        title={
                                                                                            value
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            value
                                                                                        }
                                                                                    </td>
                                                                                )
                                                                            )}
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Pagination
                                                    currentPage={page}
                                                    totalItems={allData.length}
                                                    itemsPerPage={rowsPerPage}
                                                    onPageChange={setPage}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
