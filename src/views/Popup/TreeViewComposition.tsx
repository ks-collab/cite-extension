import * as React from "react";
import { Popper, Grow, Paper, ClickAwayListener, styled } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DocumentCollection } from "models/api/response.types";
import { TreeItem, TreeView } from "@mui/lab";
import { grey } from "utils/color";

const StyledButton = styled("button")(
  ({ theme }) => `
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #aaaaaa;
  border-radius: 0.75em;
  width: 368px;
  padding: 8px;
  text-align: left;
  line-height: 1.15;
  margin-left: auto;
  color: ${grey[900]};

  &:hover {
    cursor: pointer
  }

  &.expanded {
    background: #fff;
    border: 1px solid #27569b;
    &::after {
      content: '▾';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }

  div {
    width: 95%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: bottom;
  }
  `
);

interface Props {
  list: DocumentCollection[];
  onChange: (target: DocumentCollection) => void;
  selected?: DocumentCollection;
}

const TreeViewComposition = ({ list, onChange, selected }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleToggleTree = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  // const handleChangeSelection = (event: Event | React.SyntheticEvent, item: T) => {
  //   if (selected === undefined || item.id !== selected.id) {
  //     onChange(item);
  //   }
  //   handleClose(event);
  // }

  const handleSelectCollection = (
    event: React.SyntheticEvent,
    nodeId: string
  ) => {
    if (nodeId) {
      const target = list.filter((item) => item.id === parseInt(nodeId))[0];
      onChange(target);
    }
    // handleClose(event)
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

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
        <TreeItem
          key={item.id}
          nodeId={item.id.toString()}
          label={item.name}
          sx={{ fontSize: 14 }}
        >
          {generateSubLogic()}
        </TreeItem>
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
    return "...";
  };

  return (
    <>
      <StyledButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className={open ? "expanded" : ""}
      >
        <div>{generatePathName() || "..."}</div>
      </StyledButton>
      <Popper
        style={{ zIndex: 1000 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "left top",
            }}
          >
            <Paper style={{ maxHeight: 160, overflow: "auto", width: 368 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <TreeView
                  defaultCollapseIcon={<ExpandMoreIcon color="primary" />}
                  defaultExpandIcon={<ChevronRightIcon color="primary" />}
                  selected={selected?.id.toString() || ""}
                  expanded={expanded}
                  onNodeToggle={handleToggleTree}
                  onNodeSelect={handleSelectCollection}
                  sx={{ fontSize: 12 }}
                >
                  {list
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((item) => renderTreeItem(item, 0))}
                </TreeView>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default TreeViewComposition;
