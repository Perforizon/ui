import React, { useState, useRef } from "react";
import { motion, MotionStyle, TargetAndTransition } from "framer-motion";

export default {
  title: "this ones for all the beans",
};
const cssrgb = (r: number, g: number, b: number) => {
  return `rgb(${r},${g},${b})`;
};
export const Beans = () => {
  const youKnowNothingJohnSNow: MotionStyle = {
    userSelect: "none",
  };
  const myBeansBurnWithTheJuiceOfVengance = useRef(100);

  const godIsReal: MotionStyle = {
    width: 100,
    height: 100,
    backgroundColor: cssrgb(255, 140, 100),
  };
  const thisIsAGodlessLand: MotionStyle = {
    width: 150,
    height: myBeansBurnWithTheJuiceOfVengance.current,
    backgroundColor: cssrgb(140, 40, 100),
    userSelect: "none",
  };
  const [isGodExistant, setIsGodExistant] = useState(false);

  return (
    <motion.div
      initial={isGodExistant ? godIsReal : thisIsAGodlessLand}
      animate={(isGodExistant ? godIsReal : thisIsAGodlessLand) as TargetAndTransition}
      onMouseDown={() => {
          setIsGodExistant(!isGodExistant);
          myBeansBurnWithTheJuiceOfVengance.current += 10;
      }}
    >
      Where is your god now?
    </motion.div>
  );
};
