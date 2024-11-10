import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const FilterIcon = () => {
    return (
        <Svg width={32} height={32} viewBox="0 0 29.054 29.055">
            <Defs>
                <LinearGradient id="grad1" x1="0%" y1="50%" x2="100%" y2="50%">
                    <Stop offset="30%" stopColor="#7d2aca" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#ad50cd" stopOpacity="1" />
                </LinearGradient>
            </Defs>

            <Path
                d="M26.536,0.501v4.094c0,0.147-0.063,0.287-0.178,0.383l-8.722,7.354v16.223c0,0.197-0.116,0.377-0.299,0.457
        c-0.063,0.029-0.134,0.043-0.201,0.043c-0.123,0-0.243-0.045-0.338-0.133l-5.217-4.785c-0.104-0.094-0.162-0.229-0.162-0.367
        V12.331L2.698,4.977C2.586,4.881,2.519,4.743,2.519,4.594V0.5c0-0.275,0.225-0.5,0.5-0.5h23.015
        C26.311,0.001,26.536,0.224,26.536,0.501z"
                fill="url(#grad1)" 
            />
        </Svg>
    );
};

export default FilterIcon;