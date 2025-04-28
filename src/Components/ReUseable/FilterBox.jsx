// import React from 'react';
// import Checkbox from '../ReUseable/ChechBox';

// const FilterBox = ({ filters, onChange, title, filterKey, group }) => {
//     return (
//         <label className='flex gap-2 items-center'>
//             <Checkbox
//                 name={filterKey}
//                 checked={filters[filterKey]}
//                 onChange={(e) => onChange(e, group)}
//             />
//             {title}
//         </label>
//     );
// };

// export default FilterBox;

import React from 'react';
import Checkbox from '../ReUseable/ChechBox';

const FilterBox = ({ filters, onChange, title, filterKey, group }) => {
    return (
        <label className='flex gap-2 items-center'>
            <Checkbox
                name={filterKey}
                checked={filters[filterKey]}
                onChange={(e) => onChange(e, group)}
            />
            {title}
        </label>
    );
};

export default FilterBox;
