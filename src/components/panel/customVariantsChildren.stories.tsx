import React, {
  ReactNode,
  Children,
  ReactComponentElement,
  Component,
  ComponentType,
  ForwardRefExoticComponent,
  ReactElement,
  cloneElement,
} from "react";
import { motion, MotionProps } from "framer-motion";
import { keysIn } from "lodash-es";

export default {
  title: "ChildTest",
};

interface UserPropsType {
  children?: ReactNode;
  amIAlive?: boolean;
  years?: number;
}

let UserViewPort = (userProps: UserPropsType) => {
  return (
    <div>
      {`${
        userProps.amIAlive
          ? `Just cause your breathing...don't mean your alive`
          : `Excuses are useless!!!`
      }`}
      <br />
      {`You've been ${userProps.amIAlive ? `alive` : `dead`} for ${
        userProps.years
      } years`}
      {userProps.children}
    </div>
  );
};

const withLoading = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => ({ ...props }) => <Component {...(props as P)} />;

interface ScrollbarElementProps {
  children?: ReactNode | ReactNode[];
  isStraight?: boolean;
}
/** ISSUE:
 *      When 2 Components are combined together in a HOC,
 *      they **will** have overlapping properties. This prevents
 *      users from setting individual component's properties seperately
 */
const scrollbar = {
  viewport: <P0 extends object>(
    Viewport: ComponentType<P0>
  ): React.FC<P0 & ScrollbarElementProps> => {
    return (props: P0 & ScrollbarElementProps) => {
      return (
        <Viewport {...(props as P0 & ScrollbarElementProps)} key={"viewport"}>
          <br />
          {props.isStraight
            ? "but at least your straight, also im a viewport"
            : "but your gay, also im a viewport"}
          <br />
          {props.children}
        </Viewport>
      );
    };
  },
  track: <P0 extends object>(
    Track: ComponentType<P0>
  ): React.FC<P0 & ScrollbarElementProps> => {
    return (props: P0 & ScrollbarElementProps) => {
      return (
        <Track {...(props as P0 & ScrollbarElementProps)} key={"track"}>
          <br />
          {props.isStraight
            ? "but at least your straight, also im a track"
            : "but your gay, also im a track"}
          <br />
          {props.children}
        </Track>
      );
    };
  },
  thumb: <P0 extends object>(
    Track: ComponentType<P0>
  ): React.FC<P0 & ScrollbarElementProps> => {
    return (props: P0 & ScrollbarElementProps) => {
      return (
        <Track {...(props as P0 & ScrollbarElementProps)} key={"track"}>
          <br />
          {props.isStraight
            ? "but at least your straight, also im a track"
            : "but your gay, also im a track"}
          <br />
          {props.children}
        </Track>
      );
    };
  },
  contentWrapper: <P0 extends object>(
    Track: ComponentType<P0>
  ): React.FC<P0 & ScrollbarElementProps> => {
    return (props: P0 & ScrollbarElementProps) => {
      return (
        <Track {...(props as P0 & ScrollbarElementProps)} key={"track"}>
          <br />
          {props.isStraight
            ? "but at least your straight, also im a track"
            : "but your gay, also im a track"}
          <br />
          {props.children}
        </Track>
      );
    };
  },
  Scrollbar: (props: ScrollbarElementProps): JSX.Element => {
    let Track: ReactElement = undefined;
    let Thumb: ReactElement = undefined;
    let Viewport: ReactElement = undefined;
    let ContentWrapper: ReactElement = undefined;
    let Content: ReactElement[] = new Array<ReactElement>();

     const children =  Array.isArray(props.children) ? props.children : [props.children];

    for (const child of children as ReactNode[]) {
      const childElement = child as ReactElement;

      if (childElement) {
        if (childElement.key == "viewport") {
            Viewport = cloneElement(childElement);
        }
        if (childElement.key == "track") {
            Track = childElement;
        }
        if (childElement.key == "thumb") Thumb = childElement;
        if (childElement.key == "content-wrapper") ContentWrapper = childElement;
        if (childElement.key == "thumb") Thumb = childElement;
      }
    }
    Viewport = Viewport || <div/>;
    return (
        <div>
            this is a scrollbar
            {Viewport}
        </div>
    )
  },
};

const UserViewPortNew = scrollbar.viewport(UserViewPort);
const UserThumb = scrollbar.thumb(UserViewPort);
export const ChildVariantTestStory1 = () => {
  return (
    <div>
    <scrollbar.Scrollbar>
        <UserViewPortNew />
    </scrollbar.Scrollbar>
    </div>
  )
};
