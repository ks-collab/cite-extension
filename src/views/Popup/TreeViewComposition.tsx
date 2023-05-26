import React, { SyntheticEvent, useRef, useState } from "react";
import { Popper, ClickAwayListener, styled, Box, Typography, useTheme, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DocumentCollection } from "models/api/response.types";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { TreeItem, TreeItemProps, TreeView } from "@mui/lab";
import CollectionTreeItem from "./CollectionTreeItem";

const Container = styled(Box)(({theme}) => ({
    background: theme.background.light,
    border: `1px solid rgba(0, 0, 0, 0.23)`,
    padding: "5px 10px",
    cursor: "pointer",
    "&:hover": {
      border: `1px solid rgba(0, 0, 0, 0.87)`,
    },
    "&.expanded": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    borderRadius: "4px",
    alignItems: "center",
    "& .title": {
      color: theme.palette.text.primary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
}));

interface Props {
  list: DocumentCollection[];
  onChange: (target?: DocumentCollection) => void;
  selected?: DocumentCollection;
}

const TreeViewComposition = ({ list, onChange, selected }: Props) => {
  const theme = useTheme()
  const [menuOpen, setMenuOpen] = useState<null | HTMLElement>(null);
  const [collectionExpanded, setCollectionExpanded] = useState<string[]>([]);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleCollectionChange = (
    nodeId: string
  ) => {
    if (nodeId) {
      const target = list.filter((item) => item.id === parseInt(nodeId))[0];
      onChange(target);
    }
    setMenuOpen(null)
  };

  const expandCollection = (nodeId: string) => {
    if (collectionExpanded.includes(nodeId)) {
      setCollectionExpanded(
        collectionExpanded.filter((node: string) => node !== nodeId)
      );
    } else {
      setCollectionExpanded([...collectionExpanded, nodeId]);
    }
  };

  const CustomTreeItem = (props: TreeItemProps) => (
    <TreeItem ContentComponent={CollectionTreeItem} {...props} />
  );

  const renderTreeItem = (item: DocumentCollection, lvl: number) => {
    if (list) {
      const children = list.filter((coll) => {
        return coll.parent_id === item.id;
      });

      const generateSubLogic = () => {
        return children.map((child) => renderTreeItem(child, lvl + 1));
      };

      if (item.parent_id > 0 && lvl === 0) {
        return null;
      }

      return (
        <CustomTreeItem
          key={item.id}
          nodeId={item.id.toString()}
          ContentProps={
            {
              handleCollectionChange,
              expandCollection,
              collectionLabel: item.name,
              selectedCollection: selected,
            } as any
          }
        >
          {generateSubLogic()}
        </CustomTreeItem>
      );
    }
    return null;
  };

  const generatePathName = () => {
    const paths: string[] = [];
    let hasParent = true;
    if (selected) {
      let current = { ...selected };
      paths.push(current.name);
      while (hasParent) {
        let i = 0;
        for (; i < list.length; i++) {
          if (list[i].id === current.parent_id) {
            paths.push(list[i].name);
            current = { ...list[i] };
            break;
          }
        }
        if (i === list.length) {
          hasParent = false;
        }
      }
      return paths.reverse().join("/");
    }
    return "All documents";
  };

  return (
    <>
      <Container
        ref={anchorRef}
        id="composition-button"
        onClick={(e) => {
          setMenuOpen(e.currentTarget);
        }}
        className={menuOpen ? "expanded" : ""}
      >
        <Typography variant="body2" className="title">
          {generatePathName() || "All documents"}
        </Typography>
        <KeyboardArrowDownIcon
          color="action"
          sx={
            menuOpen
              ? {
                  transform: "rotate(180deg)",
                }
              : {}
          }
        />
      </Container>
      {menuOpen && (
        <ClickAwayListener
          onClickAway={() => {
            setMenuOpen(null)
          }}
        >
          <Popper
            open={!!menuOpen}
            anchorEl={menuOpen}
            placement="bottom-start"
            sx={{
              borderRadius: "4px",
              border: `1px solid #E9E9E9`,
              boxShadow: `0 0.5rem 1rem rgba(149, 157, 165, 0.2)`,
              maxHeight: "160px",
              width: anchorRef.current
                ? `${anchorRef.current.offsetWidth}px`
                : "300px",
              zIndex: 1301,
              backgroundColor: theme.background.light,
              overflow: "auto",
            }}
          >
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon color="primary" />}
              defaultExpandIcon={<ChevronRightIcon color="primary" />}
              expanded={collectionExpanded}
            >
              <ListItemButton
                selected={!selected}
                sx={{
                  padding: "0px 16px",
                  height: "32px",
                }}
                onClick={() => {
                  onChange(undefined);
                  setMenuOpen(null)
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    marginRight: "1.2rem",
                  }}
                >
                  <AutoStoriesOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2">All documents</Typography>
                </ListItemText>
              </ListItemButton>
              {list
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => renderTreeItem(item, 0))}
            </TreeView>
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default TreeViewComposition;
