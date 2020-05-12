import React from "react";
import {SaturationBrightness} from "./saturation-brightness";
import {Opacity} from "./opacity";
import {Hue} from "./hue";
import {Swatch} from "./swatch"
import CSS from "csstype";

interface AhabColorPickerProps {
    /**  size in pixels of the entire color picker */
    size: number
    /** percentage of the `size` property to be used to render the `saturation-brightness` component 
     * (the remaining percentage will be used to render `opacity`, `hue`, and `swatch` components)
    */
    saturationBrightnessPercentSize: number
    /** percentage of the `size` property to be spaced between each component
    */
    gapPercentageSize: number
}

export const AhabColorPicker = (props : AhabColorPickerProps) => {

    const size = props.size;
    const borderSize = 2;
    const saturationBrightnessSize = props.saturationBrightnessPercentSize * props.size;
    const opacityHueSwatchSize = (1-props.saturationBrightnessPercentSize) * props.size;
    const gapSize = props.gapPercentageSize * props.size;
    const hGapSize = gapSize/2;
    return (
        <div 
            id={"ahab-color-picker"} 
            style={{
                position: "relative",
                width:size, 
                height:size, 
                backgroundColor:"blue"
            }}
        >
            <SaturationBrightness  
                id={"saturation-brightness"} 
                width={saturationBrightnessSize-hGapSize-borderSize}
                height={saturationBrightnessSize-hGapSize-borderSize}
                boxSliderProps={{barStyle:{boxShadow:`0px 0px 0px ${borderSize}px rgba(154,154,155,1)`}}}
                style={{position:"absolute", top:borderSize, left:borderSize}}
                borderSize={borderSize}
            />
            <Hue
                width={opacityHueSwatchSize-hGapSize}
                height={saturationBrightnessSize-hGapSize}
                borderSize={borderSize}
                style={{
                    position: "absolute",
                    left: saturationBrightnessSize+hGapSize,
                    top: 0,
                }}
            />
            {/* <div 
                id={"hue"}  
                style={{
                    position: "absolute",
                    left: saturationBrightnessSize+hGapSize,
                    top: 0,
                    width: opacityHueSwatchSize-hGapSize,
                    height: saturationBrightnessSize-hGapSize,
                    backgroundColor: "cyan"
                }}
            /> */}
            <div
                id={"opacity"} 
                style={{
                    position: "absolute",
                    top: saturationBrightnessSize+hGapSize,
                    left: 0,
                    width: saturationBrightnessSize-hGapSize,
                    height: opacityHueSwatchSize-hGapSize,
                    backgroundColor: "purple",
                }}
            />
            <div 
            id={"swatch"} 
            style={{
                position: "absolute",
                top: saturationBrightnessSize+hGapSize,
                left: saturationBrightnessSize+hGapSize,
                width: opacityHueSwatchSize-hGapSize,
                height: opacityHueSwatchSize-hGapSize,
                backgroundColor: "yellow"
            }}
            />
        </div>
    )
}