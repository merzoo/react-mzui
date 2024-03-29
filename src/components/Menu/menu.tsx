import React, { useState, createContext } from "react";
import classNames from "classnames";
import { ItemProps } from "./menuItem";

type MenuMode = "horizontal" | "vertical";
type SelectCallback = (selectedIndex: string) => void;

export interface MenuProps {
  defaultIndex?: string;
  className?: string;
  mode?: MenuMode;
  style?: React.CSSProperties;
  defaultOpenSubMenus?: string[];
  children?: React.ReactNode;
  onSelect?: SelectCallback;
}

interface IMenuContext {
  index: string;
  onSelect?: SelectCallback;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<IMenuContext>({ index: "0" });

const Menu: React.FC<MenuProps> = ({
  defaultIndex,
  className,
  mode,
  style,
  onSelect,
  children,
  defaultOpenSubMenus,
  ...restProps
}) => {
  const [currentActive, setActive] = useState(defaultIndex);

  const classes = classNames("merzoo-menu", className, {
    "menu-vertical": mode === "vertical",
    "menu-horizontal": mode !== "vertical",
  });

  const handleClick = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : "0",
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus,
  };

  const renderChildren = () =>
    React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<ItemProps>;
      const { displayName } = childElement.type;

      if (displayName === "MenuItem" || displayName === "SubMenu") {
        return React.cloneElement(childElement, {
          index: index.toString(),
        });
      } else {
        console.error("Warning: Menu has a child which is not a MenuItem!");
      }
    });

  return (
    <ul
      className={classes}
      style={style}
      {...restProps}
      data-testid="test-menu"
    >
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: "0",
  mode: "horizontal",
  defaultOpenSubMenus: [],
};

// Menu.Item = Item;

export default Menu;
