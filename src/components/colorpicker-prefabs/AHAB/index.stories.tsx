import React, { useState } from "react"
import {AhabColorPicker} from "."
import {VEC4} from "@perforizon/math"

export default {
    title: "color-pickers"
};

export const AHAB = () => {
    const [color, setColor] = useState<VEC4>([1,0,0,1]);
    return (
        <AhabColorPicker 
            size={350} 
            borderSize={4}
            saturationBrightnessPercentSize={.855} 
            gapPercentageSize={.03}
            setColor={setColor}
        />
    )
}
