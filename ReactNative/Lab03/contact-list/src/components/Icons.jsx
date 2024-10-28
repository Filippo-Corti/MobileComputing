import {
    Add01Icon,
    Search01Icon,
    Delete02Icon,
    Menu01Icon,
    ArrowLeft01Icon,
    PencilEdit01Icon
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

export const BackArrowIcon = ({ size, color }) => {
    return (
        <ArrowLeft01Icon
            size={size}
            color={color}
            variant={"stroke"}
        />
    )
}

export const EditIcon = ({ size, color }) => {
    return (
        <PencilEdit01Icon
            size={size}
            color={color}
            variant={"stroke"}
        />
    )
}
