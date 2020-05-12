import React, {useState, useRef} from "react";
import {BoxSlider} from '.';
import OuterCursorSVG from "../../../images/slider/outer-cursor.svg"
import InnerCursorSVG from "../../../images/slider/inner-cursor-box.svg"
import {SaturationBrightnessCanvas} from "@perforizon/colorpicker";

import "../../../styles/no-select.scss";

export default {
  title: "Slider-Box"
};

export const Box = () =>{ 
  const [inputX, setInputX] = useState(1);
  const [inputY, setInputY] = useState(1);

  return (
    <div>
      <BoxSlider 
        setInputX={setInputX} 
        setInputY={setInputY}
        barHeight={200}
        barWidth={200}
        innerCursorWidth={20} 
        innerCursorHeight={20}
        outerCursorWidth={15}
        outerCursorSVG={OuterCursorSVG}
        innerCursorSVG={InnerCursorSVG}
        innerCursorStyle={{fill:"brown", backgroundColor:"rgba(0,0,0,0)"}}
        outerCursorXStyle={{backgroundColor: "rgba(0,0,0,0)"}}
        outerCursorYStyle={{backgroundColor: "rgba(0,0,0,0)"}}
      />
      <br/>
      <br/>
      <div className={"no-select"}>
        {"inputX: " + inputX.toFixed(4)}
      </div>
      <div className={"no-select"}>
        {"inputY: " + inputY.toFixed(4)}
      </div>
    </div>
  )
};

export const AHAB = () =>{ 
    const borderWidth = 2;
    const [inputX, setInputX] = useState(1);
    const [inputY, setInputY] = useState(1);

    const innerCursorVariants = {
        "default" :
        {
            fill: "rgb(200,200,200)",   
            rotateZ: 135,
            scale: 1
        },
        "highlight" :
        {
            fill: "rgb(255,255,255)",
            rotateZ: 135,
            scale: 2
        },
        "press" :
        {
            fill: "rgb(255,255,255)",
            rotateZ: 135,
        }
    };
        
    const outerCursorVariants = {
        "default" : {
            fill: "rgb(200,200,200)",
            scale: 1
        },
        "highlight" : {
            fill: "rgb(255,255,255)",
            scale: 1.5
        },
        "press" : {
            fill: "rgb(255,255,255)",
            scale: 1.5
        }
    }
    const sliderLineVariants = {
        "default" : {
            opacity: 0,
            stroke: "rgba(154,154,155)"
        },
        "highlight" : {
            opacity: 1,
            stroke: "rgba(255,255,255)"
        },
        "press" : {
            opacity: 1,
            stroke: "rgba(255,255,255)"
        }
    }

    return (
      <div>
        <BoxSlider 
          setInputX={setInputX} 
          setInputY={setInputY}
          barHeight={200}
          barWidth={200}
          innerCursorWidth={30} 
          innerCursorHeight={30}
          outerCursorWidth={15}
          outerCursorSVG={OuterCursorSVG}
          innerCursorSVG={InnerCursorSVG}
          innerCursorVariants={innerCursorVariants}
          outerCursorXVariants={outerCursorVariants}
          outerCursorYVariants={outerCursorVariants}
          innerLineXVariants={sliderLineVariants}
          innerLineYVariants={sliderLineVariants}
          barStyle={{boxShadow:`0px 0px 0px ${borderWidth}px rgba(154,154,155,1)`, background: "radial-gradient(205.25% 205.25% at 70.31% -62.17%, #CCEAF3 21.35%, #627486 68.23%)"}}
          innerLineXStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 4}}
          innerLineYStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 3}}
          innerCursorStyle={{fill:"rgb(200,200,200,1)", backgroundColor:"rgba(0,0,0,0)", strokeWidth:1, stroke: "rgb(154,154,155,1)"}}
          outerCursorXStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorYStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorOffset={2.1}
          initial={"default"}
          whileHover={"highlight"}
          whileTap={"press"}
        />
        <br/>
        <br/>
        <div className={"no-select"}>
          {"inputX: " + inputX.toFixed(4)}
        </div>
        <div className={"no-select"}>
          {"inputY: " + inputY.toFixed(4)}
        </div>
      </div>
    )
  };

  export const SaturationBrightness = () => { 
    const width = 200;
    const height = 200;
    const borderWidth = 2;
    const [inputX, setInputX] = useState(1);
    const [inputY, setInputY] = useState(1);
    const innerCursorVariants = {
        "default" :
        {
            fill: "rgb(200,200,200)",   
            rotateZ: 135,
        },
        "highlight" :
        {
            fill: "rgb(255,255,255)",
            rotateZ: 135,
            scale: 2
        },
        "press" :
        {
            fill: "rgb(255,255,255)",
            rotateZ: 135,
        }
    }
    const outerCursorVariants = {
        "default" : {
            fill: "rgb(200,200,200)",
            scale: 1
        },
        "highlight" : {
            fill: "rgb(255,255,255)",
            scale: 1.5
        },
        "press" : {
            fill: "rgb(255,255,255)",
            scale: 1.5
        }
    }
    const sliderLineVariants = {
        "default" : {
            opacity: 0,
            stroke: "rgba(154,154,155)"
        },
        "highlight" : {
            opacity: 1,
            stroke: "rgba(255,255,255)"
        },
        "press" : {
            opacity: 1,
            stroke: "rgba(255,255,255)"
        }
    }

    return (
      <div>
        <BoxSlider 
          setInputX={setInputX} 
          setInputY={setInputY}
          barHeight={height}
          barWidth={width}
          innerCursorWidth={15} 
          innerCursorHeight={15}
          outerCursorWidth={15}
        //   outerCursorSVG={OuterCursorSVG}
          innerCursorSVG={InnerCursorSVG}
          innerCursorVariants={innerCursorVariants}
          outerCursorXVariants={outerCursorVariants}
          outerCursorYVariants={outerCursorVariants}
          innerLineXVariants={sliderLineVariants}
          innerLineYVariants={sliderLineVariants}
          barStyle={{boxShadow:`0px 0px 0px ${borderWidth}px rgba(154,154,155,1)`,backgroundColor:"rgba(0,0,0,0)"}}
          innerLineXStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 4}}
          innerLineYStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 3}}
          innerCursorStyle={{fill:"rgb(200,200,200,1)", backgroundColor:"rgba(0,0,0,0)", strokeWidth:1, stroke: "rgb(154,154,155,1)"}}
          outerCursorXStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorYStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorOffset={2.1}
          initial={"default"}
          whileHover={"highlight"}
          whileTap={"press"}
        >
            <SaturationBrightnessCanvas width={width} height={height} color={[1,0,0,1]}></SaturationBrightnessCanvas>
        </BoxSlider>
        <br/>
        <br/>
        <div className={"no-select"}>
          {"inputX: " + inputX.toFixed(4)}
        </div>
        <div className={"no-select"}>
          {"inputY: " + inputY.toFixed(4)}
        </div>
      </div>
    )
  };