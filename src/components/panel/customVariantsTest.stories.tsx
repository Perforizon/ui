import React, {
  useEffect,
  useRef,
  useState,
  Ref,
  forwardRef,
  useImperativeHandle,
  ReactNodeArray,
} from "react";
import CSS from "csstype";
import { merge, intersectionBy } from "lodash-es";

export default {
  title: "variants",
};

export class ComponentTransform {
  x: string;
  y: string;
  z: string;
  scaleX: number;
  scaleY: number;
  constructor() {
    this.x = `0px`;
    this.y = `0px`;
    this.z = `0px`;
    this.scaleX = 1;
    this.scaleY = 1;
  }
  cssString = () => {
    return `
      scale(${this.scaleX}, ${this.scaleY})
      translateX(${this.x}) 
      translateY(${this.y}) 
      translateZ(${this.z})`;
  };
}

export declare type TransformProps = {
  componentTransform?: ComponentTransform;
};
export declare type TransformAssignmentProps = {
  x?: number;
  y?: number;
  z?: number;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
};
export declare type Variant = CSS.Properties & TransformAssignmentProps;
export declare type VariantLabels = string | string[];

export declare type Variants = {
  [key: string]: Variant;
};

export declare type VariantHandlers = {
  whileHover?: VariantLabels;
  whilePress?: VariantLabels;
  initial?: VariantLabels;
};

/** Omit children and ref since they do not work when passed in as props */
export declare type ReactDivProps = Omit<
  Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "ref"
  >,
  "children"
>;
export declare type VariantProps = { variants?: Variants } & VariantHandlers;
export declare type DivProps = ReactDivProps & VariantProps & TransformProps;

interface RefType {
  viewport: HTMLDivElement;
  track: HTMLDivElement;
  thumb: HTMLDivElement;
  contentWrapper: HTMLDivElement;
}

interface Props {
  children?: ReactNodeArray;
  ref?: Ref<RefType>;
  viewportProps?: DivProps;
  trackProps?: DivProps;
  thumbProps?: DivProps;
  contentWrapperProps?: DivProps;
  contentProps?: DivProps;
}
const AssignVariants = (
  variantOwner: HTMLElement,
  variantOwnerProps: DivProps,
  VariantHandlerLabel: string
) => {
  // convert variant labels from array or single value type to just an array type
  let VariantLabels: string | string[] = variantOwnerProps[VariantHandlerLabel];
  VariantLabels = [].concat(variantOwnerProps[VariantHandlerLabel] || []);

  // reduce variant labels to a single Variant value
  const Variant = VariantLabels.reduce(
    (previousValue: Variant, currentValue: string): Variant => {
      return { ...previousValue, ...variantOwnerProps.variants[currentValue] };
    },
    {}
  );

  // assign transform properties
  intersectionBy(
    Object.keys(Variant),
    Object.keys(variantOwnerProps.componentTransform)
  ).forEach((key) => {
    variantOwnerProps.componentTransform[key] = Variant[key];
  });

  // assign all corresponding fields
  Object.keys(Variant).forEach((key) => {
    variantOwner.style[key] = Variant[key];
  });

  // update transform
  variantOwner.style.transform = variantOwnerProps.componentTransform.cssString();
};

let VariantTest0 = (props: Props, ref: React.MutableRefObject<RefType>) => {
  const square: React.CSSProperties = {
    width: "100px",
    height: "100px",
  };
  const defaultProps: Props = {
    viewportProps: {
      id: "viewport",
      style: {
        ...square,
        backgroundColor: "red",
      },
      componentTransform: new ComponentTransform(),
    },
    trackProps: {
      id: "track",
      style: {
        width: "50%",
        height: "50%",
        backgroundColor: "cyan",
      },
      componentTransform: new ComponentTransform(),
    },
    thumbProps: {
      id: "thumb",
      style: {
        width: "50%",
        height: "50%",
        backgroundColor: "rgba(0,255,80, 1)",
        transition: "background-color .3s linear 0s, transform 2s ease-out 0s",
      },
      componentTransform: new ComponentTransform(),
    },
    contentWrapperProps: {
      id: "content-wrapper",
      style: {
        ...square,
        backgroundColor: "magenta",
      },
      componentTransform: new ComponentTransform(),
    },
    contentProps: {
      id: "content",
      style: {
        marginTop: "10%",
        width: "100%",
        height: "50%",
        backgroundColor: "yellow",
      },
      componentTransform: new ComponentTransform(),
    },
  };
  props = merge({}, defaultProps, props);
  /**
   *  Customize via onMouseOver/onMouseDown/etc. of individual components
   *  Don't use OnMouseOver as a way to customize style variants:
   *    steps-to-reproduce: user sets onmouseover to execute user logic
   *    expected-behavior: onmouseover user logic executes, and default variants still activate
   *    current-behavior: onmouseover user logic executes but merge({}, userProps, defaultProps)
   *        over-writes the variant logic in `onmouseover` event-listener/react-event-listener-property.
   *
   * Customize via interface properties called "variants" of individual components
   *    steps-to-reproduce: user sets variants of individual variants "mouseover" "mousedown" "mouseup"
   *    of components
   *    expected-behavior: user expects to have a way of a parent onHover to invoke child variants in
   *    an inclusive and exclusive way.border
   *    current-behavior: this method provides no way of for example, an on-hover event to trigger a specific
   *    state chagne in a child component while simultaneously offering the option to opt out of any specific child component
   *
   *  Customize via a combination of pre-defined ui events properties that can be assigned a variant (press, hover, focus, blur,
   *  etc) and the variants themselves.
   *    steps-to-reproduce: user sets variants, assigns an array of variant-keys to activate in the variant event props
   *    expected-behavior: user expects that a variant assignment event will trickle down to its children and activate
   *    child variants.
   *    current-behavior: expected-behavior
   */

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    (): RefType => ({
      get viewport() {
        return viewportRef.current;
      },
      get track() {
        return trackRef.current;
      },
      get thumb() {
        return thumbRef.current;
      },
      get contentWrapper() {
        return contentWrapperRef.current;
      },
    })
  );

  const viewportMouseDownHAndler = (event: MouseEvent) => {};
  const toggled = useRef(false);
  const thumbMouseDownHandler = (event: MouseEvent) => {
    AssignVariants(thumbRef.current, props.thumbProps, "whilePress");
  };
  const trackMouseDownHandler = (event: MouseEvent) => {};
  const contentWrapperMouseDownHandler = (event: MouseEvent) => {};
  useEffect(() => {
    viewportRef.current.addEventListener("mousedown", trackMouseDownHandler, {
      passive: true,
    });
    trackRef.current.addEventListener("mousedown", trackMouseDownHandler, {
      passive: true,
    });
    thumbRef.current.addEventListener("mousedown", thumbMouseDownHandler, {
      passive: true,
    });
    contentWrapperRef.current.addEventListener(
      "mousedown",
      trackMouseDownHandler,
      { passive: true }
    );
    return () => {
      viewportRef.current.removeEventListener(
        "mousedown",
        trackMouseDownHandler
      );
      trackRef.current.removeEventListener("mousedown", trackMouseDownHandler);
      thumbRef.current.removeEventListener("mousedown", thumbMouseDownHandler);
      contentWrapperRef.current.removeEventListener(
        "mousedown",
        trackMouseDownHandler
      );
    };
  }, []);
  return (
    <div ref={viewportRef} {...props.viewportProps}>
      <div ref={trackRef} {...props.trackProps}>
        <div ref={thumbRef} {...props.thumbProps} />
      </div>
      <div ref={contentWrapperRef} {...props.contentWrapperProps}>
        <div {...props.contentProps} />
      </div>
    </div>
  );
};

VariantTest0 = forwardRef(VariantTest0);

export const VariantTest0Story = () => {
  const ref = useRef<RefType>(null);

  return (
    <VariantTest0
      ref={ref}
      thumbProps={{
        variants: {
          active: {
            backgroundColor: "rgba(200,200,220,1)",
            scaleY: 2,
          },
          default: {
            backgroundColor: "rgba(255,0,0,1)",
            scaleY: 1,
          },
        },
        whilePress: "active",
        initial: "default",
      }}
    ></VariantTest0>
  );
};
