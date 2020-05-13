import React, { useState, useEffect } from "react";
import {VEC4} from "@perforizon/math"
import {SaturationBrightness} from "./saturation-brightness";
import {Opacity} from "./opacity";
import {Hue} from "./hue";
import {Swatch} from "./swatch"
import {SBHToRGBA, GradToHue} from "@perforizon/math-color"

interface AhabColorPickerProps {
    /**  size in pixels of the entire color picker */
    size: number
    /**  size in pixels of the innset border of each sub component*/
    borderSize:number
    /** percentage of the `size` property to be used to render the `saturation-brightness` component 
     * (the remaining percentage will be used to render `opacity`, `hue`, and `swatch` components)
    */
    saturationBrightnessPercentSize: number
    /** percentage of the `size` property to be spaced between each component
    */
    gapPercentageSize: number
    /** a react useSate setter
     *  
     * usage:
     *  ```
     *      // typescript
     *      const [color, setColor] = useState<[number,number,number,number]>([1,0,0,1])
     *      <AhabColorPicker ... setColor={setColor} />
     * 
     *      // javascript
     *      const [color, setColor] = useState([1,0,0,1])
     *      <AhabColorPicker ... setColor={setColor} />
     *  ```
    */
    setColor :  React.Dispatch<React.SetStateAction<VEC4>>;
}


export const AhabColorPicker = (props : AhabColorPickerProps) => {

    const size = Math.ceil(props.size);
    const borderSize = Math.ceil(props.borderSize);
    const opacityHueSwatchSize = Math.ceil(((1-props.saturationBrightnessPercentSize) * props.size));
    const saturationBrightnessSize = Math.ceil((props.saturationBrightnessPercentSize * props.size));
    const gapSize = Math.ceil((props.gapPercentageSize * props.size));
    const hGapSize = Math.ceil((gapSize/2));
    const dBorderSize = borderSize*2;
    
    const [color, setColor] = useState<VEC4>([1,0,0,1]);
    const [hue, setHue] = useState<VEC4>([1,0,0,1]);

    const [hueInput, setHueInput] = useState(1);
    const [opacityInput, setOpacityInput] = useState(1);
    const [saturationInput, setSaturationInput] = useState(1);
    const [brightnessInput, setBrightnessInput] = useState(1);

    useEffect(() => {
        let didCancel = false;
        async function updateColors() {
          const newColor = SBHToRGBA(saturationInput, brightnessInput, hue);
          if (!didCancel) { // Ignore if we started fetching something else
            setColor(newColor);
          }
        }  
        updateColors();
        return () => { didCancel = true; }; // Remember if we start fetching something else
      }, [saturationInput, brightnessInput, hue]
    );
    useEffect(() => {
        let didCancel = false;
        async function updateHue() {
          const newHue = GradToHue(hueInput);
          const newColor = SBHToRGBA(saturationInput, brightnessInput, newHue);
          if (!didCancel) { // Ignore if we started fetching something else
            setHue(newHue);
            setColor(newColor);
          }
        }  
        updateHue();
        return () => { didCancel = true; }; // Remember if we start fetching something else
      }, [hueInput]
    );

    return (
        <div 
            id={"ahab-color-picker"} 
            style={{
                position: "relative",
                width:size, 
                height:size, 
            }}
        >
            <SaturationBrightness  
                id={"saturation-brightness"} 
                width={saturationBrightnessSize-hGapSize-dBorderSize}
                height={saturationBrightnessSize-hGapSize-dBorderSize}
                borderSize={borderSize}
                style={{position:"absolute", top:borderSize, left:borderSize}}
                setSaturationInput={setSaturationInput}
                setBrightnessInput={setBrightnessInput}
                webglColor={hue}
                initial={{opacity:0, scale:.7}}
                animate={{opacity:1, scale:1}}
            />
            <Hue
                width={opacityHueSwatchSize-hGapSize-dBorderSize}
                height={saturationBrightnessSize-hGapSize-dBorderSize}
                /** border size is required prop for elements with outer cursors (so they can set their outer cursor offset accordingly) */
                borderSize={borderSize}
                style={{
                    position: "absolute",
                    left: saturationBrightnessSize+hGapSize+borderSize,
                    top: borderSize,
                }}
                setHueInput={setHueInput}
                initial={{opacity:0, x:-50}}
                animate={{opacity:1, x:0}}
            />

            <Swatch
                width={opacityHueSwatchSize-hGapSize-dBorderSize}
                height={opacityHueSwatchSize-hGapSize-dBorderSize}
                webglColor={color}
                webglOpacity={opacityInput}
                style={{
                    position: "absolute",
                    left: saturationBrightnessSize+hGapSize+borderSize,
                    top: saturationBrightnessSize+hGapSize+borderSize,
                    width: opacityHueSwatchSize-hGapSize-dBorderSize,
                    height: opacityHueSwatchSize-hGapSize-dBorderSize,
                    /** background color same as box shadow to prevent 1px gap glitch */
                    backgroundColor: `rgba(150,150,180,1)`,
                    boxShadow:`0px 0px 0px ${borderSize}px rgba(150,150,180,1)`
                }}
                initial={{opacity:0, x:-50,y:-50}}
                animate={{opacity:1, x:0, y:0}}
            />
            <Opacity
                width={saturationBrightnessSize-hGapSize-dBorderSize}
                height={opacityHueSwatchSize-hGapSize-dBorderSize}
                /** border size is required prop for elements with outer cursors (so they can set their outer cursor offset accordingly) */
                borderSize={props.borderSize}
                setOpacityInput={setOpacityInput}
                webglColor={color}
                style={{
                    position: "absolute",
                    left: borderSize,
                    top: saturationBrightnessSize+hGapSize+borderSize,
                    width: saturationBrightnessSize-hGapSize-dBorderSize,
                     height: opacityHueSwatchSize-hGapSize-dBorderSize
                }}
                initial={{opacity:0, y:-50}}
                animate={{opacity:1, y:0}}
            />
        </div>
    )
}