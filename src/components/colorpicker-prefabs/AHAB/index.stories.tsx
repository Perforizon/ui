import React from "react"
import {AhabColorPicker} from "."

export default {
    title: "color-pickers"
};

export const AHAB = () => {
    return (
        <AhabColorPicker 
            size={200} 
            saturationBrightnessPercentSize={.85} 
            gapPercentageSize={.04}
        />
    )
}
