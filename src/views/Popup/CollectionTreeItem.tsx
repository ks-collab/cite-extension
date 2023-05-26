import { useTreeItem } from "@mui/lab";
import { ListItemButton, ListItemIcon, ListItemText, Typography, styled } from "@mui/material";
import clsx from "clsx";
import React, { forwardRef } from "react";

const CollectionContainer = styled(ListItemButton)(() => ({
    "&.collection-item": {
        padding: "0px 16px",
        height: "32px",
        "& .MuiListItemIcon-root": {
            minWidth: "auto",
            marginRight: "1.2rem",
            "& svg": {
                height: "20px",
                width: "20px",
            },
            "& .MuiSvgIcon-root.MuiSvgIcon-colorPrimary": {
                color: "rgba(0, 0, 0, 0.54)",
            },
        },
        "&.no-icon": {
        "& .MuiListItemIcon-root": {
            marginRight: "2.5rem",
        },
        },
        "& .special-icon": {
            marginRight: "1.25rem",
        },
        "& .button-text": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        }
    },
}));

const CollectionTreeItem = forwardRef(function CustomContent(
    props: any,
    ref
  ) {
    const {
      classes,
      className,
      collectionLabel,
      nodeId,
      icon: iconProp,
      expansionIcon,
      displayIcon,
      expandCollection,
      selectedCollection,
      handleCollectionChange,
    } = props;
    const { expanded, handleSelection } = useTreeItem(nodeId);
    const id = parseInt(nodeId, 10);
    const icon = iconProp || expansionIcon || displayIcon;
  
    const handleSelectionClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      handleSelection(event);
      handleCollectionChange(id);
    };
  
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <CollectionContainer
        className={clsx(className, "collection-item", {
          [classes.expanded]: expanded,
          "no-icon": !icon,
        })}
        key={id}
        selected={selectedCollection?.id === id}
        onClick={handleSelectionClick}
      >
        <ListItemIcon
            onClick={(e: any) => {
              e.stopPropagation();
              expandCollection(nodeId);
            }}
          >
            {icon}
        </ListItemIcon>
        <ListItemText>
          <Typography className="button-text" variant="body2">{collectionLabel}</Typography>
        </ListItemText>
      </CollectionContainer>
    );
});

export default CollectionTreeItem