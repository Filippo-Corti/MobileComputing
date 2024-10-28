import {
    Add01Icon,
    Search01Icon,
    Delete02Icon,
    Menu01Icon
} from 'hugeicons-react';

export const PlusIcon = ({ size, color }) => {
    return (
        <Add01Icon
            size={size}
            color={color}
            variant={"stroke"}
        />
    )
}

export const DeleteIcon = ({ size, color }) => {
    return (
        <Delete02Icon
            size={size}
            color={color}
            variant={"stroke"}
        />
    )
}

export const SearchIcon = ({ size, color }) => {
    return (
        <Search01Icon
            size={size}
            color={color}
            variant={"stroke"}
        />
    )
}

export const MenuIcon = ({ size, color }) => {
    return (
      <Menu01Icon 
        size={size} 
        color={color}
        variant={"stroke"}
      />
    )
  }


